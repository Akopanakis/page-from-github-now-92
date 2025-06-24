
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface ValidatedInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: 'number' | 'percentage' | 'weight';
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

const ValidationHelper: React.FC<ValidatedInputProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  required = true,
  min = 0,
  max
}) => {
  const { language } = useLanguage();

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (type) {
      case 'weight':
        return language === 'gr' ? 'Εισάγετε βάρος σε kg' : 'Enter weight in kg';
      case 'percentage':
        return language === 'gr' ? 'Ποσοστό %' : 'Percentage %';
      default:
        return language === 'gr' ? 'Εισάγετε αριθμό' : 'Enter number';
    }
  };

  const getMaxValue = () => {
    if (max !== undefined) return max;
    if (type === 'percentage') return 100;
    return undefined;
  };

  // Enhanced input validation with security measures
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputStr = e.target.value;
    
    // Security: Prevent script injection in input
    if (/<script|javascript:|vbscript:/i.test(inputStr)) {
      console.warn('Potentially malicious input detected and blocked');
      return;
    }
    
    // Parse and validate numeric input
    const inputValue = parseFloat(inputStr);
    
    // Handle NaN and invalid inputs
    if (isNaN(inputValue) && inputStr !== '') {
      return;
    }
    
    const numericValue = isNaN(inputValue) ? 0 : inputValue;
    const maxVal = getMaxValue();
    
    // Enhanced validation logic with bounds checking
    let validatedValue = numericValue;
    
    if (validatedValue < min) {
      validatedValue = min;
    }
    
    if (maxVal && validatedValue > maxVal) {
      validatedValue = maxVal;
    }
    
    // Additional security: Prevent extremely large numbers
    const MAX_SAFE_VALUE = 999999999;
    if (validatedValue > MAX_SAFE_VALUE) {
      validatedValue = MAX_SAFE_VALUE;
    }
    
    // Security logging for unusual values
    if (Math.abs(validatedValue - numericValue) > 0.01) {
      console.log(`Input value adjusted for security/validation: ${numericValue} -> ${validatedValue}`);
    }
    
    onChange(validatedValue);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        placeholder={getPlaceholder()}
        min={min}
        max={getMaxValue()}
        required={required}
        className="w-full"
        step={type === 'percentage' ? '0.1' : '0.01'}
        // Security: Prevent autocomplete for sensitive data
        autoComplete="off"
        // Security: Additional input attributes
        pattern="[0-9]*\.?[0-9]*"
        inputMode="decimal"
      />
    </div>
  );
};

export default ValidationHelper;
