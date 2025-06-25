import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Users, Euro, Calculator } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TooltipHelper from './TooltipHelper';
import ChartExplanation from './ChartExplanation';

interface ForecastData {
  month: string;
  revenue: number;
  optimistic: number;
  pessimistic: number;
  customers: number;
}

interface RevenueParams {
  avgCustomersPerMonth: number;
  avgOrderValue: number;
  seasonalityFactor: number;
  growthRate: number;
  marketTrend: 'up' | 'stable' | 'down';
}

const RevenueForecasting: React.FC = () => {
  const { t, language } = useLanguage();
  const [params, setParams] = useState<RevenueParams>({
    avgCustomersPerMonth: 100,
    avgOrderValue: 50,
    seasonalityFactor: 1,
    growthRate: 5,
    marketTrend: 'stable'
  });

  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  const months = language === 'gr' 
    ? ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαϊ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const seasonalFactors = {
    'Ιαν': 0.85, 'Φεβ': 0.90, 'Μαρ': 1.05, 'Απρ': 1.10,
    'Μαϊ': 1.15, 'Ιουν': 1.20, 'Ιουλ': 1.25, 'Αυγ': 1.15,
    'Σεπ': 1.10, 'Οκτ': 1.05, 'Νοε': 0.95, 'Δεκ': 1.00,
    'Jan': 0.85, 'Feb': 0.90, 'Mar': 1.05, 'Apr': 1.10,
    'May': 1.15, 'Jun': 1.20, 'Jul': 1.25, 'Aug': 1.15,
    'Sep': 1.10, 'Oct': 1.05, 'Nov': 0.95, 'Dec': 1.00
  };

  // Memoized calculation function
  const calculateForecast = useMemo(() => {
    return () => {
      const data: ForecastData[] = months.map((month, index) => {
        const monthlyGrowth = Math.pow(1 + params.growthRate / 100, index / 12);
        const seasonal = seasonalFactors[month as keyof typeof seasonalFactors] * params.seasonalityFactor;
        
        let trendMultiplier = 1;
        if (params.marketTrend === 'up') trendMultiplier = 1 + (index * 0.02);
        else if (params.marketTrend === 'down') trendMultiplier = 1 - (index * 0.01);

        const baseCustomers = params.avgCustomersPerMonth * monthlyGrowth * seasonal * trendMultiplier;
        const baseRevenue = baseCustomers * params.avgOrderValue;

        return {
          month,
          revenue: Math.round(baseRevenue),
          optimistic: Math.round(baseRevenue * 1.2),
          pessimistic: Math.round(baseRevenue * 0.8),
          customers: Math.round(baseCustomers)
        };
      });

      setForecastData(data);
    };
  }, [params, months, seasonalFactors]);

  useEffect(() => {
    calculateForecast();
  }, [calculateForecast]);

  // Memoized summary calculations
  const summaryData = useMemo(() => {
    const totalRevenue = forecastData.reduce((sum, month) => sum + month.revenue, 0);
    const avgMonthlyRevenue = totalRevenue / 12;
    const totalCustomers = forecastData.reduce((sum, month) => sum + month.customers, 0);
    
    return {
      totalRevenue,
      avgMonthlyRevenue,
      totalCustomers
    };
  }, [forecastData]);

  // Quarterly data for additional chart
  const quarterlyData = useMemo(() => {
    if (forecastData.length === 0) return [];
    
    const quarters = [
      { name: 'Q1', months: [0, 1, 2] },
      { name: 'Q2', months: [3, 4, 5] },
      { name: 'Q3', months: [6, 7, 8] },
      { name: 'Q4', months: [9, 10, 11] }
    ];
    
    return quarters.map(quarter => {
      const quarterRevenue = quarter.months.reduce((sum, monthIndex) => 
        sum + (forecastData[monthIndex]?.revenue || 0), 0
      );
      const quarterCustomers = quarter.months.reduce((sum, monthIndex) => 
        sum + (forecastData[monthIndex]?.customers || 0), 0
      );
      
      return {
        quarter: quarter.name,
        revenue: quarterRevenue,
        customers: quarterCustomers,
        avgOrderValue: quarterCustomers > 0 ? quarterRevenue / quarterCustomers : 0
      };
    });
  }, [forecastData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}€
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Tooltip */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">
              {language === 'gr' ? 'Πρόβλεψη Εσόδων' : 'Revenue Forecasting'}
            </h3>
            <TooltipHelper tooltipKey="tooltip.revenue.forecasting" />
          </div>
          <p className="text-sm text-blue-700 mt-2">
            {language === 'gr' 
              ? 'Προβλέψτε μελλοντικά έσοδα βασισμένα σε ιστορικά δεδομένα και τάσεις αγοράς'
              : 'Forecast future revenue based on historical data and market trends'
            }
          </p>
        </CardContent>
      </Card>

      {/* Parameters Input */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Calculator className="w-5 h-5 text-blue-600" />
            <span>{language === 'gr' ? 'Παράμετροι Πρόβλεψης' : 'Forecast Parameters'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label className="flex items-center space-x-2 text-slate-700 font-medium">
                <Users className="w-4 h-4 text-blue-600" />
                <span>{language === 'gr' ? 'Μέσος Αριθμός Πελατών/Μήνα' : 'Avg Customers per Month'}</span>
              </Label>
              <Input
                type="number"
                value={params.avgCustomersPerMonth}
                onChange={(e) => setParams({...params, avgCustomersPerMonth: parseInt(e.target.value) || 0})}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="flex items-center space-x-2 text-slate-700 font-medium">
                <Euro className="w-4 h-4 text-green-600" />
                <span>{language === 'gr' ? 'Μέση Αξία Παραγγελίας (€)' : 'Avg Order Value (€)'}</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                value={params.avgOrderValue}
                onChange={(e) => setParams({...params, avgOrderValue: parseFloat(e.target.value) || 0})}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-slate-700 font-medium">
                {language === 'gr' ? 'Ρυθμός Ανάπτυξης (%)' : 'Growth Rate (%)'}
              </Label>
              <Input
                type="number"
                step="0.1"
                value={params.growthRate}
                onChange={(e) => setParams({...params, growthRate: parseFloat(e.target.value) || 0})}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-slate-700 font-medium">
                {language === 'gr' ? 'Εποχικότητα' : 'Seasonality'}
              </Label>
              <Input
                type="number"
                step="0.1"
                min="0.5"
                max="2"
                value={params.seasonalityFactor}
                onChange={(e) => setParams({...params, seasonalityFactor: parseFloat(e.target.value) || 1})}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-slate-700 font-medium">
                {language === 'gr' ? 'Τάση Αγοράς' : 'Market Trend'}
              </Label>
              <Select 
                value={params.marketTrend} 
                onValueChange={(value: 'up' | 'stable' | 'down') => setParams({...params, marketTrend: value})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="up">
                    📈 {language === 'gr' ? 'Ανοδική' : 'Upward'}
                  </SelectItem>
                  <SelectItem value="stable">
                    ➡️ {language === 'gr' ? 'Σταθερή' : 'Stable'}
                  </SelectItem>
                  <SelectItem value="down">
                    📉 {language === 'gr' ? 'Καθοδική' : 'Downward'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-600 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {language === 'gr' ? 'Ετήσια Έσοδα' : 'Annual Revenue'}
                </p>
                <p className="text-3xl font-bold text-blue-600">{summaryData.totalRevenue.toLocaleString()}€</p>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'gr' ? 'Συνολικός στόχος' : 'Total target'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {language === 'gr' ? 'Μέσα Μηνιαία Έσοδα' : 'Avg Monthly Revenue'}
                </p>
                <p className="text-3xl font-bold text-green-600">{Math.round(summaryData.avgMonthlyRevenue).toLocaleString()}€</p>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'gr' ? 'Μηνιαίος στόχος' : 'Monthly target'}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {language === 'gr' ? 'Συνολικοί Πελάτες' : 'Total Customers'}
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {summaryData.totalCustomers.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'gr' ? 'Ετήσιος στόχος' : 'Annual target'}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Explanation */}
      <ChartExplanation type="forecast" />

      {/* Forecast Chart */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>
              {language === 'gr' ? 'Πρόβλεψη Εσόδων - 12 Μήνες' : 'Revenue Forecast - 12 Months'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="optimisticGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="pessimisticGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="optimistic" 
                stroke="#10b981" 
                fill="url(#optimisticGradient)"
                strokeWidth={2}
                name={language === 'gr' ? 'Αισιόδοξο Σενάριο' : 'Optimistic Scenario'}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                fill="url(#revenueGradient)"
                strokeWidth={3}
                name={language === 'gr' ? 'Βασική Πρόβλεψη' : 'Base Forecast'}
              />
              <Area 
                type="monotone" 
                dataKey="pessimistic" 
                stroke="#ef4444" 
                fill="url(#pessimisticGradient)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name={language === 'gr' ? 'Απαισιόδοξο Σενάριο' : 'Pessimistic Scenario'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quarterly Analysis Chart */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <BarChart className="w-5 h-5 text-purple-600" />
            <span>{language === 'gr' ? 'Τριμηνιαία Ανάλυση' : 'Quarterly Analysis'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="quarter" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="revenue" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
                name={language === 'gr' ? 'Έσοδα' : 'Revenue'}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Monthly Breakdown */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>{language === 'gr' ? 'Μηνιαία Ανάλυση' : 'Monthly Breakdown'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 font-semibold text-slate-700">
                    {language === 'gr' ? 'Μήνας' : 'Month'}
                  </th>
                  <th className="text-right py-3 font-semibold text-slate-700">
                    {language === 'gr' ? 'Έσοδα' : 'Revenue'}
                  </th>
                  <th className="text-right py-3 font-semibold text-slate-700">
                    {language === 'gr' ? 'Πελάτες' : 'Customers'}
                  </th>
                  <th className="text-right py-3 font-semibold text-slate-700">
                    {language === 'gr' ? 'Αύξηση' : 'Growth'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {forecastData.map((month, index) => {
                  const growth = index > 0 ? ((month.revenue - forecastData[index - 1].revenue) / forecastData[index - 1].revenue * 100) : 0;
                  return (
                    <tr key={month.month} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 font-medium">{month.month}</td>
                      <td className="py-3 text-right font-semibold text-blue-600">
                        {month.revenue.toLocaleString()}€
                      </td>
                      <td className="py-3 text-right text-slate-600">
                        {month.customers.toLocaleString()}
                      </td>
                      <td className={`py-3 text-right text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {index > 0 ? `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueForecasting;
