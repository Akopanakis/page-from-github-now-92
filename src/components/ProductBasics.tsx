import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calculator, RotateCcw, Fish } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductBasicsProps {
  formData: any;
  updateFormData: (updates: any) => void;
  isPremium?: boolean;
}

export default function ProductBasics({ formData, updateFormData, isPremium }: ProductBasicsProps) {
  const { t, language } = useLanguage();

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Fish className="w-5 h-5 text-blue-600" />
            <span>{language === 'gr' ? 'Βασικά Στοιχεία Προϊόντος' : 'Basic Product Details'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="productName" className="text-slate-700 font-medium">
                {language === 'gr' ? 'Όνομα Προϊόντος' : 'Product Name'}
              </Label>
              <Input
                id="productName"
                type="text"
                placeholder={language === 'gr' ? 'π.χ. Θράψαλο Block' : 'e.g. Cod Block'}
                value={formData.productName || ''}
                onChange={(e) => updateFormData({ productName: e.target.value })}
                className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="initialWeight" className="text-slate-700 font-medium">
                {t('form.initialWeight')}
              </Label>
              <Input
                id="initialWeight"
                type="number"
                min="0"
                step="0.1"
                placeholder={t('placeholder.weight')}
                value={formData.initialWeight || ''}
                onChange={handleInputChange('initialWeight')}
                className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="cleaningLoss" className="text-slate-700 font-medium">
                {t('form.cleaningLoss')}
              </Label>
              <Input
                id="cleaningLoss"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder={t('placeholder.percentage')}
                value={formData.cleaningLoss || ''}
                onChange={handleInputChange('cleaningLoss')}
                className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="processingLoss" className="text-slate-700 font-medium">
                {t('form.processingLoss')}
              </Label>
              <Input
                id="processingLoss"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder={t('placeholder.percentage')}
                value={formData.processingLoss || ''}
                onChange={handleInputChange('processingLoss')}
                className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="glazingWeight" className="text-slate-700 font-medium">
                {t('form.glazingWeight')}
              </Label>
              <Input
                id="glazingWeight"
                type="number"
                min="0"
                step="0.1"
                placeholder={t('placeholder.percentage')}
                value={formData.glazingWeight || ''}
                onChange={handleInputChange('glazingWeight')}
                className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="costPerKg" className="text-slate-700 font-medium">
                {t('form.costPerKg')}
              </Label>
              <Input
                id="costPerKg"
                type="number"
                min="0"
                step="0.01"
                placeholder={t('placeholder.cost')}
                value={formData.costPerKg || ''}
                onChange={handleInputChange('costPerKg')}
                className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="profitMargin" className="text-slate-700 font-medium">
                {t('form.profitMargin')}
              </Label>
              <Input
                id="profitMargin"
                type="number"
                min="0"
                step="0.1"
                placeholder={t('placeholder.percentage')}
                value={formData.profitMargin || ''}
                onChange={handleInputChange('profitMargin')}
                className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="vatPercent" className="text-slate-700 font-medium">
                {language === 'gr' ? 'ΦΠΑ (%)' : 'VAT (%)'}
              </Label>
              <Input
                id="vatPercent"
                type="number"
                min="0"
                step="0.1"
                placeholder="24"
                value={formData.vatPercent || ''}
                onChange={handleInputChange('vatPercent')}
                className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}