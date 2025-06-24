import { useState } from 'react';
import { toast } from 'sonner';

export interface FormData {
  initialWeight: number;
  cleaningLoss: number;
  processingLoss: number;
  glazingWeight: number;
  costPerKg: number;
  profitMargin: number;
}

export interface CalculationResults {
  finalWeight: number;
  totalCost: number;
  costPerKg: number;
  sellingPrice: number;
  profit: number;
}

// Keep the Results type for backward compatibility
export type Results = CalculationResults;

export function useCalculation() {
  const [formData, setFormData] = useState<FormData>({
    initialWeight: 0,
    cleaningLoss: 0,
    processingLoss: 0,
    glazingWeight: 0,
    costPerKg: 0,
    profitMargin: 0,
  });

  const [results, setResults] = useState<CalculationResults | null>(null);

  const updateFormData = (field: keyof FormData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculate = () => {
    try {
      // Step 1: Calculate weight after cleaning
      const weightAfterCleaning = formData.initialWeight * (1 - formData.cleaningLoss / 100);
      
      // Step 2: Calculate weight after processing
      const weightAfterProcessing = weightAfterCleaning * (1 - formData.processingLoss / 100);
      
      // Step 3: Calculate final weight with glazing
      const finalWeight = weightAfterProcessing * (1 + formData.glazingWeight / 100);
      
      // Step 4: Calculate total cost
      const totalCost = formData.initialWeight * formData.costPerKg;
      
      // Step 5: Calculate cost per kg of final product
      const costPerKg = totalCost / finalWeight;
      
      // Step 6: Calculate selling price with profit margin
      const sellingPrice = costPerKg * (1 + formData.profitMargin / 100);
      
      // Step 7: Calculate total profit
      const profit = (sellingPrice - costPerKg) * finalWeight;

      const calculationResults: CalculationResults = {
        finalWeight,
        totalCost,
        costPerKg,
        sellingPrice,
        profit,
      };

      setResults(calculationResults);
      toast.success('Calculation completed successfully!');
    } catch (error) {
      toast.error('Error in calculation. Please check your inputs.');
    }
  };

  const reset = () => {
    setFormData({
      initialWeight: 0,
      cleaningLoss: 0,
      processingLoss: 0,
      glazingWeight: 0,
      costPerKg: 0,
      profitMargin: 0,
    });
    setResults(null);
  };

  return {
    formData,
    results,
    updateFormData,
    calculate,
    reset,
  };
}
