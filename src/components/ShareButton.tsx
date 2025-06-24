
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

    // Create a comprehensive share text
    let shareText = `${shareData.title}\n\n${shareData.text}\n\n`;
    
    if (formData) {
      shareText += language === 'gr' ? 'Στοιχεία:\n' : 'Details:\n';
      shareText += `• ${language === 'gr' ? 'Αρχικό Βάρος' : 'Initial Weight'}: ${formData.initialWeight || 0}kg\n`;
      shareText += `• ${language === 'gr' ? 'Κόστος ανά kg' : 'Cost per kg'}: €${formData.costPerKg || 0}\n`;
      if (formData.profitMargin) {
        shareText += `• ${language === 'gr' ? 'Περιθώριο Κέρδους' : 'Profit Margin'}: ${formData.profitMargin}%\n`;
      }
    }

    if (results) {
      shareText += `\n${language === 'gr' ? 'Αποτελέσματα' : 'Results'}:\n`;
      shareText += `• ${language === 'gr' ? 'Τελικό Βάρος' : 'Final Weight'}: ${results.finalWeight?.toFixed(2) || 0}kg\n`;
      shareText += `• ${language === 'gr' ? 'Συνολικό Κόστος' : 'Total Cost'}: €${results.totalCost?.toFixed(2) || 0}\n`;
      shareText += `• ${language === 'gr' ? 'Τιμή Πώλησης' : 'Selling Price'}: €${results.sellingPrice?.toFixed(2) || 0}\n`;
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
        // Fallback to clipboard
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
      // Final fallback - manual copy
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
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
