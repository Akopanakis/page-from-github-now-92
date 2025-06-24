
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import ProductBasics from './ProductBasics';
import ResultsSection from './ResultsSection';
import AnalysisTab from './AnalysisTab';
import ShareButton from './ShareButton';
import { useCalculation } from '../hooks/useCalculation';

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { formData, results, updateFormData, calculate, reset } = useCalculation();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'gr' ? 'en' : 'gr');
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          {language === 'gr' ? 'Κοστολόγηση Πρώτων Υλών' : 'Raw Material Costing'}
        </h1>
        <div className="flex gap-2">
          <ShareButton formData={formData} results={results} />
          <Button variant="outline" size="icon" onClick={toggleLanguage}>
            <Languages className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="calculation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculation">{t('nav.calculation')}</TabsTrigger>
          <TabsTrigger value="batches">{t('nav.batches')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('nav.analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="calculation" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ProductBasics
              formData={formData}
              onUpdate={updateFormData}
              onCalculate={calculate}
              onReset={reset}
            />
            {results && <ResultsSection results={results} />}
          </div>
        </TabsContent>

        <TabsContent value="batches">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {language === 'gr' ? 'Λίστα παρτίδων - Σε ανάπτυξη' : 'Batch list - Under development'}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalysisTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
