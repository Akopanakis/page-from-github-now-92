
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Plus, Trash2, BarChart3, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TooltipHelper from './TooltipHelper';
import ChartExplanation from './ChartExplanation';

interface Scenario {
  id: string;
  name: string;
  priceIncrease: number;
  costIncrease: number;
  demandChange: number;
  profit: number;
  revenue: number;
}

interface ScenarioAnalysisProps {
  baseResults: any;
  formData: any;
}

const ScenarioAnalysis: React.FC<ScenarioAnalysisProps> = ({ baseResults, formData }) => {
  const { t, language } = useLanguage();
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: language === 'gr' ? 'Βασικό Σενάριο' : 'Base Scenario',
      priceIncrease: 0,
      costIncrease: 0,
      demandChange: 0,
      profit: baseResults?.profitPerKg || 0,
      revenue: baseResults?.sellingPrice || 0
    }
  ]);

  const [newScenario, setNewScenario] = useState({
    name: '',
    priceIncrease: 0,
    costIncrease: 0,
    demandChange: 0
  });

  const scenarioTemplates = [
    { 
      name: language === 'gr' ? 'Οικονομική Κρίση' : 'Economic Crisis', 
      priceIncrease: -10, 
      costIncrease: 15, 
      demandChange: -25 
    },
    { 
      name: language === 'gr' ? 'Ανάπτυξη Αγοράς' : 'Market Growth', 
      priceIncrease: 8, 
      costIncrease: 3, 
      demandChange: 20 
    },
    { 
      name: language === 'gr' ? 'Αύξηση Πρώτων Υλών' : 'Raw Material Increase', 
      priceIncrease: 5, 
      costIncrease: 12, 
      demandChange: -5 
    }
  ];

  const calculateScenarioResults = (scenario: any) => {
    if (!baseResults) return { profit: 0, revenue: 0 };

    const adjustedPrice = baseResults.sellingPrice * (1 + scenario.priceIncrease / 100);
    const adjustedCost = baseResults.totalCostWithVat * (1 + scenario.costIncrease / 100);
    const adjustedProfit = adjustedPrice - (adjustedCost / baseResults.netWeight);
    const adjustedRevenue = adjustedPrice * (formData.quantity || 1) * (1 + scenario.demandChange / 100);

    return {
      profit: adjustedProfit,
      revenue: adjustedRevenue
    };
  };

  const addScenario = () => {
    if (!newScenario.name) return;

    const results = calculateScenarioResults(newScenario);
    const scenario: Scenario = {
      id: Date.now().toString(),
      ...newScenario,
      ...results
    };

    setScenarios([...scenarios, scenario]);
    setNewScenario({ name: '', priceIncrease: 0, costIncrease: 0, demandChange: 0 });
  };

  const addTemplate = (template: any) => {
    const results = calculateScenarioResults(template);
    const scenario: Scenario = {
      id: Date.now().toString(),
      ...template,
      ...results
    };

    setScenarios([...scenarios, scenario]);
  };

  const removeScenario = (id: string) => {
    if (scenarios.length > 1) {
      setScenarios(scenarios.filter(s => s.id !== id));
    }
  };

  // Memoized chart data
  const chartData = useMemo(() => {
    return scenarios.map(scenario => ({
      name: scenario.name.length > 15 ? scenario.name.substring(0, 15) + '...' : scenario.name,
      [language === 'gr' ? 'Κέρδος/Κιλό' : 'Profit/Kg']: scenario.profit,
      [language === 'gr' ? 'Έσοδα' : 'Revenue']: scenario.revenue / 100,
      [language === 'gr' ? 'ROI' : 'ROI']: baseResults ? (scenario.profit / (baseResults.totalCostWithVat / baseResults.netWeight)) * 100 : 0
    }));
  }, [scenarios, baseResults, language]);

  // Sensitivity analysis data
  const sensitivityData = useMemo(() => {
    if (!baseResults) return [];
    
    const baseProfit = baseResults.profitPerKg;
    const variations = [-20, -15, -10, -5, 0, 5, 10, 15, 20];
    
    return variations.map(variation => ({
      variation: `${variation >= 0 ? '+' : ''}${variation}%`,
      priceChange: baseProfit * (1 + (variation * 1.5) / 100), // Price is more sensitive
      costChange: baseProfit * (1 - variation / 100), // Cost change (inverse)
      demandChange: baseProfit * (1 + variation / 200) // Demand is less sensitive
    }));
  }, [baseResults]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
              {entry.name.includes('ROI') ? '%' : '€'}
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
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">
              {language === 'gr' ? 'Ανάλυση Σεναρίων' : 'Scenario Analysis'}
            </h3>
            <TooltipHelper tooltipKey="tooltip.scenario.analysis" />
          </div>
          <p className="text-sm text-blue-700 mt-2">
            {language === 'gr' 
              ? 'Εξετάστε διαφορετικά σενάρια για να κατανοήσετε την επίδραση αλλαγών στην κερδοφορία'
              : 'Examine different scenarios to understand the impact of changes on profitability'
            }
          </p>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <AlertTriangle className="w-5 h-5 text-indigo-600" />
            <span>{language === 'gr' ? 'Έτοιμα Σενάρια' : 'Quick Scenarios'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarioTemplates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => addTemplate(template)}
                className="h-auto p-4 text-left flex flex-col items-start space-y-2 hover:bg-indigo-50"
              >
                <span className="font-semibold">{template.name}</span>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>{language === 'gr' ? 'Τιμή' : 'Price'}: {template.priceIncrease >= 0 ? '+' : ''}{template.priceIncrease}%</div>
                  <div>{language === 'gr' ? 'Κόστος' : 'Cost'}: {template.costIncrease >= 0 ? '+' : ''}{template.costIncrease}%</div>
                  <div>{language === 'gr' ? 'Ζήτηση' : 'Demand'}: {template.demandChange >= 0 ? '+' : ''}{template.demandChange}%</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Scenario */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Plus className="w-5 h-5 text-purple-600" />
            <span>{language === 'gr' ? 'Προσαρμοσμένο Σενάριο' : 'Custom Scenario'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-slate-700 font-medium flex items-center space-x-1">
                <span>{language === 'gr' ? 'Όνομα Σεναρίου' : 'Scenario Name'}</span>
              </Label>
              <Input
                value={newScenario.name}
                onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                placeholder={language === 'gr' ? 'π.χ. Αύξηση κόστους 10%' : 'e.g. Cost increase 10%'}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-700 font-medium flex items-center space-x-1">
                <span>{language === 'gr' ? 'Αύξηση Τιμής (%)' : 'Price Increase (%)'}</span>
                <TooltipHelper tooltipKey="tooltip.price.increase" />
              </Label>
              <Input
                type="number"
                value={newScenario.priceIncrease}
                onChange={(e) => setNewScenario({...newScenario, priceIncrease: parseFloat(e.target.value) || 0})}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-700 font-medium flex items-center space-x-1">
                <span>{language === 'gr' ? 'Αύξηση Κόστους (%)' : 'Cost Increase (%)'}</span>
                <TooltipHelper tooltipKey="tooltip.cost.increase" />
              </Label>
              <Input
                type="number"
                value={newScenario.costIncrease}
                onChange={(e) => setNewScenario({...newScenario, costIncrease: parseFloat(e.target.value) || 0})}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-700 font-medium flex items-center space-x-1">
                <span>{language === 'gr' ? 'Αλλαγή Ζήτησης (%)' : 'Demand Change (%)'}</span>
                <TooltipHelper tooltipKey="tooltip.demand.change" />
              </Label>
              <Input
                type="number"
                value={newScenario.demandChange}
                onChange={(e) => setNewScenario({...newScenario, demandChange: parseFloat(e.target.value) || 0})}
                className="mt-1"
              />
            </div>
          </div>
          <Button 
            onClick={addScenario} 
            className="mt-4 bg-purple-600 hover:bg-purple-700"
            disabled={!newScenario.name}
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'gr' ? 'Προσθήκη Σεναρίου' : 'Add Scenario'}
          </Button>
        </CardContent>
      </Card>

      {/* Chart Explanation */}
      <ChartExplanation type="scenario" />

      {/* Scenarios Comparison Chart */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>{language === 'gr' ? 'Σύγκριση Σεναρίων' : 'Scenario Comparison'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey={language === 'gr' ? 'Κέρδος/Κιλό' : 'Profit/Kg'} 
                fill="url(#profitGradient)" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey={language === 'gr' ? 'Έσοδα' : 'Revenue'} 
                fill="url(#revenueGradient)" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sensitivity Analysis Chart */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>{language === 'gr' ? 'Ανάλυση Ευαισθησίας' : 'Sensitivity Analysis'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sensitivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="variation" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="priceChange" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name={language === 'gr' ? 'Αλλαγή Τιμής' : 'Price Change'}
              />
              <Line 
                type="monotone" 
                dataKey="costChange" 
                stroke="#ef4444" 
                strokeWidth={3}
                name={language === 'gr' ? 'Αλλαγή Κόστους' : 'Cost Change'}
              />
              <Line 
                type="monotone" 
                dataKey="demandChange" 
                stroke="#10b981" 
                strokeWidth={3}
                name={language === 'gr' ? 'Αλλαγή Ζήτησης' : 'Demand Change'}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Scenarios List */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>{language === 'gr' ? 'Αποθηκευμένα Σενάρια' : 'Saved Scenarios'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {scenarios.map((scenario) => {
              const profitChange = scenario.id !== '1' ? ((scenario.profit - scenarios[0].profit) / scenarios[0].profit * 100) : 0;
              const revenueChange = scenario.id !== '1' ? ((scenario.revenue - scenarios[0].revenue) / scenarios[0].revenue * 100) : 0;
              
              return (
                <div key={scenario.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                      <span>{scenario.name}</span>
                      {scenario.id !== '1' && (
                        <span className={`text-xs px-2 py-1 rounded-full ${profitChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {profitChange >= 0 ? '📈' : '📉'} {profitChange.toFixed(1)}%
                        </span>
                      )}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-slate-600">{language === 'gr' ? 'Τιμή:' : 'Price:'} </span>
                        <span className={scenario.priceIncrease >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {scenario.priceIncrease >= 0 ? '+' : ''}{scenario.priceIncrease}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600">{language === 'gr' ? 'Κόστος:' : 'Cost:'} </span>
                        <span className={scenario.costIncrease <= 0 ? 'text-green-600' : 'text-red-600'}>
                          {scenario.costIncrease >= 0 ? '+' : ''}{scenario.costIncrease}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600">{language === 'gr' ? 'Ζήτηση:' : 'Demand:'} </span>
                        <span className={scenario.demandChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {scenario.demandChange >= 0 ? '+' : ''}{scenario.demandChange}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600">{language === 'gr' ? 'Κέρδος:' : 'Profit:'} </span>
                        <span className="font-semibold text-blue-600">{scenario.profit.toFixed(2)}€</span>
                      </div>
                      <div>
                        <span className="text-slate-600">{language === 'gr' ? 'Έσοδα:' : 'Revenue:'} </span>
                        <span className="font-semibold text-green-600">{scenario.revenue.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                  {scenario.id !== '1' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeScenario(scenario.id)}
                      className="ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioAnalysis;
