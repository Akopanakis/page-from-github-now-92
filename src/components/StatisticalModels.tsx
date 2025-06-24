
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Target, Calculator } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TooltipHelper from './TooltipHelper';

interface StatisticalModelsProps {
  formData: any;
  results: any;
}

const StatisticalModels: React.FC<StatisticalModelsProps> = ({ formData, results }) => {
  const { language } = useLanguage();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const calculateOptimalPricing = () => {
    if (!results) return null;

    const marketDemand = 1000; // Base market demand
    const elasticity = -0.8; // Price elasticity
    const competitorPrice = (formData.competitor1 + formData.competitor2) / 2 || results.sellingPrice * 1.1;
    
    // Calculate price elasticity impact
    const demandAtCurrentPrice = marketDemand * Math.pow((results.sellingPrice / competitorPrice), elasticity);
    const optimalPrice = results.totalCostWithVat / results.netWeight * 1.25; // 25% markup
    const demandAtOptimalPrice = marketDemand * Math.pow((optimalPrice / competitorPrice), elasticity);
    
    return {
      currentPrice: results.sellingPrice,
      optimalPrice,
      currentDemand: Math.round(demandAtCurrentPrice),
      optimalDemand: Math.round(demandAtOptimalPrice),
      currentRevenue: results.sellingPrice * demandAtCurrentPrice,
      optimalRevenue: optimalPrice * demandAtOptimalPrice,
      recommendation: optimalPrice > results.sellingPrice ? 'increase' : 'decrease'
    };
  };

  const calculateBreakEvenAnalysis = () => {
    if (!results) return null;

    const fixedCosts = results.additionalCosts + (results.laborCost * 0.6); // Assume 60% of labor is fixed
    const variableCosts = results.purchaseCost + results.transportCost + (results.laborCost * 0.4);
    const variableCostPerUnit = variableCosts / (formData.quantity || 1);
    
    const breakEvenUnits = fixedCosts / (results.sellingPrice - variableCostPerUnit);
    const marginOfSafety = ((formData.quantity || 1) - breakEvenUnits) / (formData.quantity || 1) * 100;
    
    return {
      breakEvenUnits: Math.round(breakEvenUnits),
      marginOfSafety: marginOfSafety.toFixed(1),
      fixedCosts,
      variableCostPerUnit,
      contributionMargin: results.sellingPrice - variableCostPerUnit
    };
  };

  const getRiskAssessment = () => {
    if (!results) return null;

    const profitMargin = (formData.profitMargin || 0);
    const competitorGap = formData.competitor1 ? Math.abs(results.sellingPrice - formData.competitor1) / formData.competitor1 * 100 : 0;
    
    let riskLevel = 'low';
    let riskScore = 0;
    
    if (profitMargin < 10) riskScore += 30;
    else if (profitMargin < 20) riskScore += 15;
    
    if (competitorGap > 20) riskScore += 25;
    else if (competitorGap > 10) riskScore += 10;
    
    if (results.totalCost > results.sellingPrice * (formData.quantity || 1)) riskScore += 40;
    
    if (riskScore > 50) riskLevel = 'high';
    else if (riskScore > 25) riskLevel = 'medium';
    
    return { riskLevel, riskScore, recommendations: getRiskRecommendations(riskLevel) };
  };

  const getRiskRecommendations = (riskLevel: string) => {
    const recommendations = {
      low: language === 'el' 
        ? ['Διατηρήστε την τρέχουσα στρατηγική', 'Εξετάστε επέκταση αγοράς', 'Βελτιστοποιήστε τις διαδικασίες']
        : ['Maintain current strategy', 'Consider market expansion', 'Optimize processes'],
      medium: language === 'el'
        ? ['Αναθεωρήστε την τιμολογιακή στρατηγική', 'Μειώστε το κόστος λειτουργίας', 'Ενισχύστε την ανταγωνιστικότητα']
        : ['Review pricing strategy', 'Reduce operational costs', 'Enhance competitiveness'],
      high: language === 'el'
        ? ['Άμεση αναθεώρηση τιμών', 'Δραστική μείωση κόστους', 'Αναζήτηση νέων αγορών']
        : ['Immediate price revision', 'Drastic cost reduction', 'Seek new markets']
    };
    return recommendations[riskLevel as keyof typeof recommendations] || [];
  };

  const models = [
    {
      id: 'pricing',
      title: language === 'el' ? 'Βελτιστοποίηση Τιμολόγησης' : 'Price Optimization',
      description: language === 'el' 
        ? 'Στατιστικό μοντέλο για εύρεση βέλτιστης τιμής βάσει ελαστικότητας ζήτησης'
        : 'Statistical model to find optimal price based on demand elasticity',
      icon: <Target className="w-5 h-5" />,
      data: calculateOptimalPricing()
    },
    {
      id: 'breakeven',
      title: language === 'el' ? 'Ανάλυση Νεκρού Σημείου' : 'Break-Even Analysis',
      description: language === 'el'
        ? 'Υπολογισμός σημείου ισορροπίας και περιθωρίου ασφαλείας'
        : 'Calculate break-even point and margin of safety',
      icon: <Calculator className="w-5 h-5" />,
      data: calculateBreakEvenAnalysis()
    },
    {
      id: 'risk',
      title: language === 'el' ? 'Αξιολόγηση Κινδύνου' : 'Risk Assessment',
      description: language === 'el'
        ? 'Στατιστική αξιολόγηση επιχειρηματικού κινδύνου και συστάσεις'
        : 'Statistical business risk assessment and recommendations',
      icon: <AlertTriangle className="w-5 h-5" />,
      data: getRiskAssessment()
    }
  ];

  const renderModelResults = (model: any) => {
    if (!model.data) return null;

    switch (model.id) {
      case 'pricing':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">
                  {language === 'el' ? 'Τρέχουσα Τιμή' : 'Current Price'}
                </h4>
                <p className="text-2xl font-bold text-blue-600">{model.data.currentPrice.toFixed(2)}€</p>
                <p className="text-sm text-blue-600">
                  {language === 'el' ? 'Ζήτηση:' : 'Demand:'} {model.data.currentDemand} {language === 'el' ? 'μονάδες' : 'units'}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">
                  {language === 'el' ? 'Βέλτιστη Τιμή' : 'Optimal Price'}
                </h4>
                <p className="text-2xl font-bold text-green-600">{model.data.optimalPrice.toFixed(2)}€</p>
                <p className="text-sm text-green-600">
                  {language === 'el' ? 'Ζήτηση:' : 'Demand:'} {model.data.optimalDemand} {language === 'el' ? 'μονάδες' : 'units'}
                </p>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800">
                {language === 'el' ? 'Σύσταση' : 'Recommendation'}
              </h4>
              <p className="text-yellow-700">
                {model.data.recommendation === 'increase' 
                  ? (language === 'el' ? 'Αύξηση τιμής για μεγιστοποίηση κερδών' : 'Increase price to maximize profits')
                  : (language === 'el' ? 'Μείωση τιμής για αύξηση όγκου πωλήσεων' : 'Decrease price to increase sales volume')
                }
              </p>
            </div>
          </div>
        );

      case 'breakeven':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800">
                  {language === 'el' ? 'Νεκρό Σημείο' : 'Break-Even Point'}
                </h4>
                <p className="text-2xl font-bold text-red-600">{model.data.breakEvenUnits}</p>
                <p className="text-sm text-red-600">{language === 'el' ? 'μονάδες' : 'units'}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">
                  {language === 'el' ? 'Περιθώριο Ασφαλείας' : 'Margin of Safety'}
                </h4>
                <p className="text-2xl font-bold text-green-600">{model.data.marginOfSafety}%</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">
                  {language === 'el' ? 'Συνεισφορά/Μονάδα' : 'Contribution/Unit'}
                </h4>
                <p className="text-2xl font-bold text-blue-600">{model.data.contributionMargin.toFixed(2)}€</p>
              </div>
            </div>
          </div>
        );

      case 'risk': {
        const riskColors = {
          low: 'green',
          medium: 'yellow',
          high: 'red'
        };
        const riskColor = riskColors[model.data.riskLevel as keyof typeof riskColors];
        
        return (
          <div className="space-y-4">
            <div className={`p-4 bg-${riskColor}-50 rounded-lg`}>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant={model.data.riskLevel === 'low' ? 'default' : 'destructive'}>
                  {language === 'el' 
                    ? (model.data.riskLevel === 'low' ? 'Χαμηλός' : model.data.riskLevel === 'medium' ? 'Μέτριος' : 'Υψηλός')
                    : model.data.riskLevel.charAt(0).toUpperCase() + model.data.riskLevel.slice(1)
                  } {language === 'el' ? 'Κίνδυνος' : 'Risk'}
                </Badge>
                <span className="text-sm text-gray-600">
                  {language === 'el' ? 'Βαθμολογία:' : 'Score:'} {model.data.riskScore}/100
                </span>
              </div>
              <h4 className="font-semibold mb-2">
                {language === 'el' ? 'Συστάσεις:' : 'Recommendations:'}
              </h4>
              <ul className="space-y-1">
                {model.data.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
        <CardTitle className="flex items-center space-x-2 text-slate-800">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>{language === 'el' ? 'Στατιστικά Μοντέλα & Λύσεις' : 'Statistical Models & Solutions'}</span>
          <TooltipHelper tooltipKey="tooltip.statistical.models" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {models.map((model) => (
            <Button
              key={model.id}
              variant={selectedModel === model.id ? "default" : "outline"}
              onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
              className="h-auto p-4 text-left flex flex-col items-start space-y-2"
            >
              <div className="flex items-center space-x-2">
                {model.icon}
                <span className="font-semibold">{model.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">{model.description}</p>
            </Button>
          ))}
        </div>

        {selectedModel && (
          <div className="border-t pt-6">
            {renderModelResults(models.find(m => m.id === selectedModel))}
          </div>
        )}

        {!results && (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{language === 'el' 
              ? 'Εκτελέστε πρώτα τον υπολογισμό για να δείτε τα στατιστικά μοντέλα'
              : 'Run the calculation first to see statistical models'
            }</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticalModels;
