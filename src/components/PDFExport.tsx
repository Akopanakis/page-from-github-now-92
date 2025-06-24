
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface PDFExportProps {
  results: any;
  formData: any;
}

const PDFExport: React.FC<PDFExportProps> = ({ results, formData }) => {
  const { language } = useLanguage();
  const [selectedCharts, setSelectedCharts] = useState({
    costBreakdown: true,
    profitAnalysis: true,
    competitorComparison: false,
    financialForecast: false
  });

  const exportToPDF = async () => {
    try {
      const title = language === 'gr' ? 'Αναφορά Κοστολόγησης' : 'Costing Report';
      const productLabel = language === 'gr' ? 'Προϊόν:' : 'Product:';
      const dateLabel = language === 'gr' ? 'Ημερομηνία:' : 'Date:';
      const basicDataLabel = language === 'gr' ? 'Βασικά Στοιχεία' : 'Basic Data';
      const resultsLabel = language === 'gr' ? 'Αποτελέσματα' : 'Results';
      const costAnalysisLabel = language === 'gr' ? 'Ανάλυση Κόστους' : 'Cost Analysis';
      const summaryLabel = language === 'gr' ? 'Περίληψη με Βασικά Σημεία' : 'Summary with Key Points';
      const keyPointsLabel = language === 'gr' ? 'Βασικά Σημεία:' : 'Key Points:';
      
      // Generate chart sections if selected
      const chartSections = [];
      
      if (selectedCharts.costBreakdown) {
        chartSections.push(`
          <div class="section">
            <h2>${language === 'gr' ? 'Ανάλυση Κόστους' : 'Cost Breakdown'}</h2>
            <div class="chart-explanation">
              <p>${language === 'gr' 
                ? 'Το γράφημα δείχνει την κατανομή των κοστών ανά κατηγορία. Το μεγαλύτερο κόστος προέρχεται από την αγορά πρώτων υλών.'
                : 'The chart shows cost distribution by category. The largest cost comes from raw material purchase.'
              }</p>
            </div>
          </div>
        `);
      }

      if (selectedCharts.profitAnalysis) {
        chartSections.push(`
          <div class="section">
            <h2>${language === 'gr' ? 'Ανάλυση Κερδοφορίας' : 'Profitability Analysis'}</h2>
            <div class="chart-explanation">
              <p>${language === 'gr' 
                ? 'Η ανάλυση δείχνει το περιθώριο κέρδους και τη σχέση κόστους-εσόδων. Υψηλότερο περιθώριο σημαίνει καλύτερη κερδοφορία.'
                : 'The analysis shows profit margin and cost-revenue relationship. Higher margin means better profitability.'
              }</p>
            </div>
          </div>
        `);
      }

      // Create comprehensive HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #1e40af;
              margin-bottom: 10px;
            }
            .section { 
              margin-bottom: 30px; 
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #3b82f6;
            }
            .section h2 {
              color: #1e40af;
              margin-bottom: 15px;
              font-size: 1.2em;
            }
            .grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
              margin-bottom: 20px;
            }
            .cost-item { 
              display: flex; 
              justify-content: space-between; 
              margin: 8px 0; 
              padding: 8px;
              background: white;
              border-radius: 4px;
            }
            .cost-item strong {
              color: #1e40af;
            }
            .result-box { 
              background: #f0f9ff; 
              padding: 20px; 
              margin: 15px 0; 
              border-radius: 8px; 
              border: 1px solid #bae6fd;
            }
            .result-box h3 {
              color: #0c4a6e;
              margin-bottom: 10px;
            }
            .highlight {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              margin: 10px 0;
            }
            .summary {
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .summary h3 {
              color: #15803d;
              margin-bottom: 15px;
            }
            .summary ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .summary li {
              margin: 8px 0;
              line-height: 1.5;
            }
            .chart-explanation {
              background: #fef3c7;
              border: 1px solid #fcd34d;
              padding: 15px;
              border-radius: 6px;
              margin-top: 15px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #64748b;
              font-size: 0.9em;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            .key-points {
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .key-points h4 {
              color: #1e40af;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p><strong>${productLabel}</strong> ${formData.productName || (language === 'gr' ? 'Μη καθορισμένο' : 'Not specified')}</p>
            <p><strong>${dateLabel}</strong> ${new Date().toLocaleDateString(language === 'gr' ? 'el-GR' : 'en-US')}</p>
          </div>
          
          <div class="summary">
            <h3>${summaryLabel}</h3>
            <div class="key-points">
              <h4>${keyPointsLabel}</h4>
              <ul>
                <li><strong>${language === 'gr' ? 'Υπολογισμός ρυθμού ανάπτυξης:' : 'Growth rate calculation:'}</strong> ${language === 'gr' 
                  ? 'Ο υπολογισμός γίνεται με τον τύπο: (Τελική Αξία / Αρχική Αξία) - 1. Απαιτούνται η τελική και η αρχική τιμή για τον υπολογισμό του ποσοστού ανάπτυξης.'
                  : 'Calculated using: (Final Value / Initial Value) - 1. Requires final and initial values to calculate growth percentage.'
                }</li>
                <li><strong>${language === 'gr' ? 'Επενδυτική στρατηγική:' : 'Investment strategy:'}</strong> ${language === 'gr' 
                  ? 'Λήψη επενδυτικών αποφάσεων με βάση τον υπολογισμό του ποσοστού ανάπτυξης και την ανάλυση κινδύνου.'
                  : 'Making investment decisions based on growth rate calculation and risk analysis.'
                }</li>
                <li><strong>${language === 'gr' ? 'Παρούσα Αξία (PV):' : 'Present Value (PV):'}</strong> ${language === 'gr' 
                  ? 'Διερευνάται η έννοια της παρούσας αξίας για την αξιολόγηση επενδυτικών επιλογών.'
                  : 'Exploring the concept of present value to evaluate investment options.'
                }</li>
                <li><strong>${language === 'gr' ? 'Κόστος Ευκαιρίας:' : 'Opportunity Cost:'}</strong> ${language === 'gr' 
                  ? 'Η απόδοση που χάνετε επιλέγοντας μια επένδυση αντί για την καλύτερη εναλλακτική.'
                  : 'The return you give up by choosing one investment over the best alternative.'
                }</li>
                <li><strong>${language === 'gr' ? 'Ανάλυση Νεκρού Σημείου:' : 'Break-even Analysis:'}</strong> ${language === 'gr' 
                  ? 'Δείχνει εύκολα την ποσότητα που απαιτείται για να καλύψει το σταθερό κόστος.'
                  : 'Easily shows the quantity required to cover fixed costs.'
                }</li>
              </ul>
            </div>
          </div>
          
          <div class="section">
            <h2>${basicDataLabel}</h2>
            <div class="grid">
              <div class="cost-item">
                <span>${language === 'gr' ? 'Τιμή Αγοράς:' : 'Purchase Price:'}</span>
                <strong>${formData.purchasePrice || 0}€/${language === 'gr' ? 'κιλό' : 'kg'}</strong>
              </div>
              <div class="cost-item">
                <span>${language === 'gr' ? 'Ποσότητα:' : 'Quantity:'}</span>
                <strong>${formData.quantity || 0} ${language === 'gr' ? 'κιλά' : 'kg'}</strong>
              </div>
              <div class="cost-item">
                <span>${language === 'gr' ? 'Απώλεια:' : 'Waste:'}</span>
                <strong>${formData.waste || 0}%</strong>
              </div>
              <div class="cost-item">
                <span>${language === 'gr' ? 'Ποσοστό Γλασσαρίσματος:' : 'Glazing Percentage:'}</span>
                <strong>${formData.glazingPercent || 0}%</strong>
              </div>
              <div class="cost-item">
                <span>${language === 'gr' ? 'ΦΠΑ:' : 'VAT:'}</span>
                <strong>${formData.vatPercent || 0}%</strong>
              </div>
              <div class="cost-item">
                <span>${language === 'gr' ? 'Περιθώριο Κέρδους:' : 'Profit Margin:'}</span>
                <strong>${formData.profitMargin || 0}%</strong>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>${resultsLabel}</h2>
            <div class="grid">
              <div class="result-box">
                <h3>${language === 'gr' ? 'Συνολικό Κόστος' : 'Total Cost'}</h3>
                <div class="highlight">
                  <span style="font-size: 24px; font-weight: bold;">${results?.totalCost?.toFixed(2) || 0}€</span>
                </div>
              </div>
              <div class="result-box">
                <h3>${language === 'gr' ? 'Τιμή Πώλησης' : 'Selling Price'}</h3>
                <div class="highlight">
                  <span style="font-size: 24px; font-weight: bold;">${results?.sellingPrice?.toFixed(2) || 0}€/${language === 'gr' ? 'κιλό' : 'kg'}</span>
                </div>
              </div>
              <div class="result-box">
                <h3>${language === 'gr' ? 'Κέρδος ανά Κιλό' : 'Profit per Kg'}</h3>
                <div class="highlight">
                  <span style="font-size: 24px; font-weight: bold;">${results?.profitPerKg?.toFixed(2) || 0}€</span>
                </div>
              </div>
              <div class="result-box">
                <h3>${language === 'gr' ? 'Καθαρό Βάρος' : 'Net Weight'}</h3>
                <div class="highlight">
                  <span style="font-size: 24px; font-weight: bold;">${results?.netWeight?.toFixed(2) || 0} ${language === 'gr' ? 'κιλά' : 'kg'}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>${costAnalysisLabel}</h2>
            <div class="cost-item">
              <span>${language === 'gr' ? 'Κόστος Αγοράς:' : 'Purchase Cost:'}</span>
              <strong>${results?.purchaseCost?.toFixed(2) || 0}€</strong>
            </div>
            <div class="cost-item">
              <span>${language === 'gr' ? 'Κόστος Εργασίας:' : 'Labor Cost:'}</span>
              <strong>${results?.laborCost?.toFixed(2) || 0}€</strong>
            </div>
            <div class="cost-item">
              <span>${language === 'gr' ? 'Κόστος Συσκευασίας:' : 'Packaging Cost:'}</span>
              <strong>${results?.packagingCost?.toFixed(2) || 0}€</strong>
            </div>
            <div class="cost-item">
              <span>${language === 'gr' ? 'Κόστος Μεταφοράς:' : 'Transport Cost:'}</span>
              <strong>${results?.transportCost?.toFixed(2) || 0}€</strong>
            </div>
            <div class="cost-item">
              <span>${language === 'gr' ? 'Επιπλέον Κόστη:' : 'Additional Costs:'}</span>
              <strong>${results?.additionalCosts?.toFixed(2) || 0}€</strong>
            </div>
            <div class="cost-item">
              <span>${language === 'gr' ? 'ΦΠΑ:' : 'VAT:'}</span>
              <strong>${results?.vatAmount?.toFixed(2) || 0}€</strong>
            </div>
          </div>

          ${chartSections.join('')}

          <div class="footer">
            <p>${language === 'gr' ? 'Αναφορά παραχθείσα από τον Υπολογιστή Κόστους Pro' : 'Report generated by Cost Calculator Pro'}</p>
            <p>Design by Alexandros Kopanakis</p>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${language === 'gr' ? 'κοστολογηση' : 'costing'}_${formData.productName || 'product'}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(
        language === 'gr' 
          ? 'Η αναφορά εξήχθη επιτυχώς!' 
          : 'Report exported successfully!'
      );
    } catch (error) {
      toast.error(
        language === 'gr' 
          ? 'Σφάλμα κατά την εξαγωγή του PDF' 
          : 'Error exporting PDF'
      );
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>{language === 'gr' ? 'Εξαγωγή Αναφοράς' : 'Export Report'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">
            {language === 'gr' ? 'Επιλέξτε γραφήματα για εξαγωγή:' : 'Select charts to export:'}
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="costBreakdown"
                checked={selectedCharts.costBreakdown}
                onCheckedChange={(checked) => 
                  setSelectedCharts(prev => ({ ...prev, costBreakdown: checked as boolean }))
                }
              />
              <label htmlFor="costBreakdown" className="text-sm flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>{language === 'gr' ? 'Ανάλυση Κόστους' : 'Cost Breakdown'}</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="profitAnalysis"
                checked={selectedCharts.profitAnalysis}
                onCheckedChange={(checked) => 
                  setSelectedCharts(prev => ({ ...prev, profitAnalysis: checked as boolean }))
                }
              />
              <label htmlFor="profitAnalysis" className="text-sm flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>{language === 'gr' ? 'Ανάλυση Κερδοφορίας' : 'Profitability Analysis'}</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="competitorComparison"
                checked={selectedCharts.competitorComparison}
                onCheckedChange={(checked) => 
                  setSelectedCharts(prev => ({ ...prev, competitorComparison: checked as boolean }))
                }
              />
              <label htmlFor="competitorComparison" className="text-sm flex items-center space-x-2">
                <PieChart className="w-4 h-4" />
                <span>{language === 'gr' ? 'Σύγκριση Ανταγωνισμού' : 'Competitor Comparison'}</span>
              </label>
            </div>
          </div>
        </div>

        <Button onClick={exportToPDF} className="w-full" size="lg">
          <Download className="w-4 h-4 mr-2" />
          {language === 'gr' ? 'Εξαγωγή Αναφοράς' : 'Export Report'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PDFExport;
