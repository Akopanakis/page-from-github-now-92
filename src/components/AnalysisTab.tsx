import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface AnalysisTabProps {
  formData?: any;
  updateFormData?: (updates: any) => void;
}

export default function AnalysisTab({ formData, updateFormData }: AnalysisTabProps) {
  const { language } = useLanguage();
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const savedBatches = JSON.parse(localStorage.getItem('batches') || '[]');
    setBatches(savedBatches);
  }, []);

  const chartData = batches.map((batch: any, index: number) => ({
    name: `Batch ${index + 1}`,
    cost: batch.results?.totalCost || 0,
    profit: batch.results?.profit || 0,
    date: new Date(batch.date).toLocaleDateString(),
  }));

  const pieData = batches.length > 0 ? [
    {
      name: language === 'gr' ? 'Κόστος' : 'Cost',
      value: batches.reduce((sum: number, batch: any) => sum + (batch.results?.totalCost || 0), 0),
      color: '#ef4444'
    },
    {
      name: language === 'gr' ? 'Κέρδος' : 'Profit',
      value: batches.reduce((sum: number, batch: any) => sum + (batch.results?.profit || 0), 0),
      color: '#22c55e'
    }
  ] : [];

  if (batches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {language === 'gr' 
            ? 'Δεν υπάρχουν δεδομένα για ανάλυση. Κάντε κάποιους υπολογισμούς πρώτα.' 
            : 'No data available for analysis. Make some calculations first.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'gr' ? 'Εξέλιξη Κόστους ανά Παρτίδα' : 'Cost Evolution per Batch'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'gr' ? 'Αναλογία Κόστους/Κέρδους' : 'Cost/Profit Ratio'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}