import { useState } from 'react';
import { toast } from 'sonner';

export interface FormData {
  initialWeight: number;
  cleaningLoss: number;
  processingLoss: number;
  glazingWeight: number;
  costPerKg: number;
  profitMargin: number;
  // Additional fields for enhanced functionality
  productName?: string;
  quantity?: number;
  waste?: number;
  glazingPercent?: number;
  vatPercent?: number;
  purchasePrice?: number;
  workers?: Array<{
    id: string;
    hourlyRate: number;
    hours: number;
  }>;
  boxCost?: number;
  bagCost?: number;
  electricityCost?: number;
  equipmentCost?: number;
  insuranceCost?: number;
  rentCost?: number;
  communicationCost?: number;
  otherCosts?: number;
  originAddress?: string;
  destinationAddress?: string;
  distance?: number;
  tolls?: number;
  fuelCost?: number;
  parkingCost?: number;
  driverSalary?: number;
  routeCalculated?: boolean;
  estimatedDuration?: string;
  processingPhases?: Array<{
    id: string;
    name: string;
    wastePercentage: number;
    addedWeight: number;
    description: string;
  }>;
}

export interface CalculationResults {
  finalWeight: number;
  totalCost: number;
  costPerKg: number;
  sellingPrice: number;
  profit: number;
  netWeight: number;
  purchaseCost: number;
  laborCost: number;
  packagingCost: number;
  transportCost: number;
  additionalCosts: number;
  vatAmount: number;
  totalCostWithVat: number;
  profitPerKg: number;
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
    quantity: 0,
    workers: [{ id: '1', hourlyRate: 4.5, hours: 1 }],
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const calculate = () => {
    setIsCalculating(true);
    
    try {
      // Step 1: Calculate weight after cleaning
      const weightAfterCleaning = formData.initialWeight * (1 - formData.cleaningLoss / 100);
      
      // Step 2: Calculate weight after processing
      const weightAfterProcessing = weightAfterCleaning * (1 - formData.processingLoss / 100);
      
      // Step 3: Calculate final weight with glazing
      const finalWeight = weightAfterProcessing * (1 + formData.glazingWeight / 100);
      
      // Step 4: Calculate costs
      const purchaseCost = formData.initialWeight * formData.costPerKg;
      
      // Labor cost calculation
      const laborCost = (formData.workers || []).reduce((sum, worker) => 
        sum + (worker.hourlyRate * worker.hours), 0
      );
      
      // Packaging cost
      const packagingCost = (formData.boxCost || 0) + (formData.bagCost || 0);
      
      // Transport cost
      const transportCost = (formData.fuelCost || 0) + (formData.tolls || 0) + 
                           (formData.parkingCost || 0) + (formData.driverSalary || 0);
      
      // Additional costs
      const additionalCosts = (formData.electricityCost || 0) + (formData.equipmentCost || 0) +
                             (formData.insuranceCost || 0) + (formData.rentCost || 0) +
                             (formData.communicationCost || 0) + (formData.otherCosts || 0);
      
      // Total cost before VAT
      const totalCost = purchaseCost + laborCost + packagingCost + transportCost + additionalCosts;
      
      // VAT calculation
      const vatAmount = totalCost * ((formData.vatPercent || 0) / 100);
      const totalCostWithVat = totalCost + vatAmount;
      
      // Step 5: Calculate cost per kg of final product
      const costPerKg = totalCostWithVat / finalWeight;
      
      // Step 6: Calculate selling price with profit margin
      const sellingPrice = costPerKg * (1 + formData.profitMargin / 100);
      
      // Step 7: Calculate total profit
      const profit = (sellingPrice - costPerKg) * finalWeight;
      const profitPerKg = sellingPrice - costPerKg;

      const calculationResults: CalculationResults = {
        finalWeight,
        totalCost: totalCostWithVat,
        costPerKg,
        sellingPrice,
        profit,
        netWeight: finalWeight,
        purchaseCost,
        laborCost,
        packagingCost,
        transportCost,
        additionalCosts,
        vatAmount,
        totalCostWithVat,
        profitPerKg,
      };

      setResults(calculationResults);
      toast.success('Calculation completed successfully!');
    } catch (error) {
      toast.error('Error in calculation. Please check your inputs.');
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      initialWeight: 0,
      cleaningLoss: 0,
      processingLoss: 0,
      glazingWeight: 0,
      costPerKg: 0,
      profitMargin: 0,
      quantity: 0,
      workers: [{ id: '1', hourlyRate: 4.5, hours: 1 }],
    });
    setResults(null);
  };

  return {
    formData,
    results,
    isCalculating,
    updateFormData,
    calculate,
    resetForm,
    reset: resetForm, // Alias for backward compatibility
  };
}