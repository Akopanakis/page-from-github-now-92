
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChartExplanationProps {
  type: 'cost' | 'margin' | 'profitability' | 'scenario' | 'forecast';
  data?: any;
}

const ChartExplanation: React.FC<ChartExplanationProps> = ({ type, data }) => {
  const { language } = useLanguage();

  const getExplanation = () => {
    switch (type) {
      case 'cost':
        return language === 'gr' 
          ? `Αυτό το γράφημα αναλύει τη σύνθεση του κόστους. Το άμεσο κόστος (${data?.directCost?.toFixed(2) || 0}€) περιλαμβάνει πρώτες ύλες και εργασία, ενώ το έμμεσο κόστος (${data?.indirectCost?.toFixed(2) || 0}€) περιλαμβάνει γενικά έξοδα λειτουργίας. Η κατανόηση αυτής της ανάλυσης βοηθά στον εντοπισμό περιοχών εξοικονόμησης κόστους.`
          : `This chart analyzes cost composition. Direct cost (€${data?.directCost?.toFixed(2) || 0}) includes raw materials and labor, while indirect cost (€${data?.indirectCost?.toFixed(2) || 0}) includes general operating expenses. Understanding this breakdown helps identify cost-saving opportunities.`;
      
      case 'margin':
        return language === 'gr'
          ? `Ανάλυση περιθωρίων κέρδους: Εμφανίζει τη σχέση μεταξύ κόστους, τιμής πώλησης και κέρδους. Το τρέχον περιθώριο είναι ${data?.margin?.toFixed(1) || 0}%. Ένα υγιές περιθώριο κέρδους για τις περισσότερες επιχειρήσεις είναι 15-25%. Εάν το περιθώριό σας είναι χαμηλότερο, εξετάστε τη βελτιστοποίηση κόστους ή την αύξηση τιμών.`
          : `Margin analysis: Shows the relationship between cost, selling price and profit. Current margin is ${data?.margin?.toFixed(1) || 0}%. A healthy profit margin for most businesses is 15-25%. If your margin is lower, consider cost optimization or price increases.`;
      
      case 'profitability':
        return language === 'gr'
          ? `Ανάλυση κερδοφορίας: Συγκρίνει έσοδα, κόστη και κέρδη ανά μήνα. Το νεκρό σημείο επιτυγχάνεται όταν τα έσοδα ισούνται με το συνολικό κόστος. Οι περίοδοι πάνω από τη γραμμή κόστους δείχνουν κερδοφορία, ενώ κάτω από αυτή δείχνουν ζημίες. Αυτή η ανάλυση βοηθά στον προγραμματισμό και τη λήψη στρατηγικών αποφάσεων.`
          : `Profitability analysis: Compares revenue, costs and profits monthly. Break-even point is achieved when revenue equals total cost. Periods above the cost line show profitability, while below show losses. This analysis helps with planning and strategic decision-making.`;
      
      case 'scenario':
        return language === 'gr'
          ? `Ανάλυση σεναρίων: Εξετάζει διαφορετικές υποθέσεις για αλλαγές στις τιμές, κόστη ή ζήτηση. Κάθε σενάριο δείχνει πώς αυτές οι αλλαγές επηρεάζουν την κερδοφορία. Χρησιμοποιήστε αυτά τα δεδομένα για να προετοιμαστείτε για διαφορετικές συνθήκες αγοράς και να λάβετε πληροφορημένες αποφάσεις.`
          : `Scenario analysis: Examines different assumptions for changes in prices, costs or demand. Each scenario shows how these changes affect profitability. Use this data to prepare for different market conditions and make informed decisions.`;
      
      case 'forecast':
        return language === 'gr'
          ? `Πρόβλεψη εσόδων: Εκτιμά μελλοντικά έσοδα βασισμένη σε ιστορικά δεδομένα, εποχικότητα και τάσεις αγοράς. Οι προβλέψεις λαμβάνουν υπόψη κυκλικές διακυμάνσεις και τάσεις ανάπτυξης. Αυτές οι πληροφορίες είναι κρίσιμες για τον προγραμματισμό παραγωγής, τη διαχείριση αποθεμάτων και τη χρηματοοικονομική πρόβλεψη.`
          : `Revenue forecast: Estimates future revenue based on historical data, seasonality and market trends. Forecasts consider cyclical variations and growth trends. This information is critical for production planning, inventory management and financial forecasting.`;
      
      default:
        return language === 'gr' ? 'Δεν υπάρχει διαθέσιμη εξήγηση για αυτό το γράφημα.' : 'No explanation available for this chart.';
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50 mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">
              {language === 'gr' ? 'Εξήγηση Γραφήματος' : 'Chart Explanation'}
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed">{getExplanation()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartExplanation;
