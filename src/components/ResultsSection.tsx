import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TrendingUp, Download, Save, Calculator, RotateCcw, Crown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

interface ResultsSectionProps {
  results: any;
  formData?: any;
  isCalculating?: boolean;
  isPremium?: boolean;
  onCalculate: () => void;
  onReset: () => void;
}

export default function ResultsSection({ 
  results, 
  formData, 
  isCalculating, 
  isPremium, 
  onCalculate, 
  onReset 
}: ResultsSectionProps) {
  const { t, language } = useLanguage();

  const handleSave = () => {
    if (!results) return;
    
    const batch = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      results,
      formData,
      timestamp: Date.now(),
    };

    const existingBatches = JSON.parse(localStorage.getItem('batches') || '[]');
    existingBatches.push(batch);
    localStorage.setItem('batches', JSON.stringify(existingBatches));
    
    toast.success(t('message.calculationSaved'));
  };

  const handleExport = () => {
    if (!results) return;
    
    // Simple CSV export
    const csvContent = `
Final Weight,${results.finalWeight}
Total Cost,${results.totalCost}
Cost per kg,${results.costPerKg}
Selling Price,${results.sellingPrice}
Profit,${results.profit}
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculation-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const validateAndCalculate = () => {
    if (!formData) {
      toast.error(t('message.invalidInput'));
      return;
    }
    
    // Basic validation
    if (formData.initialWeight <= 0) {
      toast.error(language === 'gr' ? 'Το αρχικό βάρος πρέπει να είναι μεγαλύτερο από 0' : 'Initial weight must be greater than 0');
      return;
    }
    if (formData.costPerKg <= 0) {
      toast.error(language === 'gr' ? 'Το κόστος ανά κιλό πρέπει να είναι μεγαλύτερο από 0' : 'Cost per kg must be greater than 0');
      return;
    }
    
    onCalculate();
  };

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xl">{t('results.title')}</span>
          </div>
          {isPremium && (
            <Badge className="bg-white text-purple-600 font-semibold">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={validateAndCalculate} 
            disabled={isCalculating}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isCalculating ? (language === 'gr' ? 'Υπολογισμός...' : 'Calculating...') : t('form.calculate')}
          </Button>
          <Button 
            variant="outline" 
            onClick={onReset}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('form.reset')}
          </Button>
        </div>

        {results ? (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <span className="font-medium text-blue-800">{t('results.finalWeight')}</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-bold">
                  {results.finalWeight.toFixed(2)} kg
                </Badge>
              </div>

              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <span className="font-medium text-purple-800">{t('results.totalCost')}</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 font-bold">
                  €{results.totalCost.toFixed(2)}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <span className="font-medium text-orange-800">{t('results.costPerKg')}</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-bold">
                  €{results.costPerKg.toFixed(2)}/kg
                </Badge>
              </div>

              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <span className="font-medium text-green-800">{t('results.sellingPrice')}</span>
                <Badge variant="default" className="bg-green-600 text-white font-bold text-lg px-4 py-2">
                  €{results.sellingPrice.toFixed(2)}/kg
                </Badge>
              </div>

              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                <span className="font-medium text-yellow-800">{t('results.profit')}</span>
                <Badge variant="default" className="bg-yellow-600 text-white font-bold text-lg px-4 py-2">
                  €{results.profit.toFixed(2)}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <Button onClick={handleSave} variant="outline" className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {t('common.save')}
              </Button>
              <Button onClick={handleExport} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                {t('common.export')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {language === 'gr' ? 'Έτοιμο για υπολογισμό' : 'Ready to Calculate'}
            </h3>
            <p className="text-sm">
              {language === 'gr' 
                ? 'Συμπληρώστε τα στοιχεία και πατήστε "Υπολόγισε"'
                : 'Fill in the details and click "Calculate"'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}