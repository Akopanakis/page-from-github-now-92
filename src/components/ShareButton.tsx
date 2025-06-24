
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Share, Copy, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

interface ShareButtonProps {
  formData?: any;
  results?: any;
}

export default function ShareButton({ formData, results }: ShareButtonProps) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const currentUrl = window.location.href;
    const shareData = {
      url: currentUrl,
      title: language === 'gr' ? 'KostoPro - Κοστολόγηση Πρώτων Υλών' : 'KostoPro - Raw Material Costing',
      text: language === 'gr' 
        ? 'Δείτε αυτή την κοστολόγηση προϊόντων θαλασσινών από το KostoPro'
        : 'Check out this seafood product costing from KostoPro'
    };

    // Create a comprehensive share text with input sanitization for security
    let shareText = `${shareData.title}\n\n${shareData.text}\n\n`;
    
    if (formData) {
      shareText += language === 'gr' ? 'Στοιχεία:\n' : 'Details:\n';
      // Enhanced input validation and sanitization
      const initialWeight = typeof formData.initialWeight === 'number' ? Math.max(0, formData.initialWeight) : 0;
      const costPerKg = typeof formData.costPerKg === 'number' ? Math.max(0, formData.costPerKg) : 0;
      const profitMargin = typeof formData.profitMargin === 'number' ? Math.max(0, Math.min(100, formData.profitMargin)) : 0;
      
      shareText += `• ${language === 'gr' ? 'Αρχικό Βάρος' : 'Initial Weight'}: ${initialWeight}kg\n`;
      shareText += `• ${language === 'gr' ? 'Κόστος ανά kg' : 'Cost per kg'}: €${costPerKg}\n`;
      if (profitMargin > 0) {
        shareText += `• ${language === 'gr' ? 'Περιθώριο Κέρδους' : 'Profit Margin'}: ${profitMargin}%\n`;
      }
    }

    if (results) {
      shareText += `\n${language === 'gr' ? 'Αποτελέσματα' : 'Results'}:\n`;
      // Enhanced result validation
      const finalWeight = typeof results.finalWeight === 'number' ? Math.max(0, results.finalWeight) : 0;
      const totalCost = typeof results.totalCost === 'number' ? Math.max(0, results.totalCost) : 0;
      const sellingPrice = typeof results.sellingPrice === 'number' ? Math.max(0, results.sellingPrice) : 0;
      
      shareText += `• ${language === 'gr' ? 'Τελικό Βάρος' : 'Final Weight'}: ${finalWeight.toFixed(2)}kg\n`;
      shareText += `• ${language === 'gr' ? 'Συνολικό Κόστος' : 'Total Cost'}: €${totalCost.toFixed(2)}\n`;
      shareText += `• ${language === 'gr' ? 'Τιμή Πώλησης' : 'Selling Price'}: €${sellingPrice.toFixed(2)}\n`;
    }

    shareText += `\n${shareData.url}`;

    try {
      // Try to use Web Share API first (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: shareData.title,
          text: shareText,
          url: shareData.url
        });
      } else {
        // Fallback to clipboard with error handling
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        toast.success(
          language === 'gr' 
            ? 'Το κείμενο αντιγράφηκε στο clipboard!' 
            : 'Text copied to clipboard!'
        );
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Enhanced error logging for security monitoring
      console.warn('Share operation failed, falling back to manual copy');
      
      // Final fallback - manual copy with enhanced security
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        toast.success(
          language === 'gr' 
            ? 'Το κείμενο αντιγράφηκε στο clipboard!' 
            : 'Text copied to clipboard!'
        );
      } catch (fallbackError) {
        console.error('Manual copy also failed:', fallbackError);
        toast.error(
          language === 'gr' 
            ? 'Σφάλμα κατά την κοινοποίηση' 
            : 'Error sharing content'
        );
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="flex items-center gap-2"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Share className="h-4 w-4" />
      )}
      {copied 
        ? (language === 'gr' ? 'Αντιγράφηκε!' : 'Copied!')
        : (language === 'gr' ? 'Κοινοποίηση' : 'Share')
      }
    </Button>
  );
}
