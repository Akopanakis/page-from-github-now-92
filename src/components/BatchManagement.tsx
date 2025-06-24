
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, Search, Filter, Download, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BatchData {
  id: string;
  date: string;
  product: string;
  supplier: string;
  initialWeightKg: number;
  cleanLossPercent: number;
  glazingPercent: number;
  buyPricePerKg: number;
  finalCostPerKg: number;
  sellingPricePerKg: number;
  estimatedProfitPercent: number;
}

const BatchManagement = () => {
  const { language } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [newBatch, setNewBatch] = useState({
    date: '',
    product: '',
    supplier: '',
    initialWeightKg: 0,
    cleanLossPercent: 20,
    glazingPercent: 15,
    buyPricePerKg: 0,
  });

  // Mock data
  const [batches, setBatches] = useState<BatchData[]>([
    {
      id: '1',
      date: '2024-01-15',
      product: 'Θράψαλο Block',
      supplier: 'Αιγαίο Α.Ε.',
      initialWeightKg: 500,
      cleanLossPercent: 20,
      glazingPercent: 15,
      buyPricePerKg: 4.5,
      finalCostPerKg: 5.29,
      sellingPricePerKg: 7.0,
      estimatedProfitPercent: 24.7
    },
    {
      id: '2',
      date: '2024-01-20',
      product: 'Σφυρίδα Φιλέτα',
      supplier: 'Θάλασσα Β.Ε.',
      initialWeightKg: 300,
      cleanLossPercent: 15,
      glazingPercent: 10,
      buyPricePerKg: 6.2,
      finalCostPerKg: 7.15,
      sellingPricePerKg: 9.5,
      estimatedProfitPercent: 24.9
    },
    {
      id: '3',
      date: '2024-02-01',
      product: 'Καλαμάρι Κύκλοι',
      supplier: 'Αιγαίο Α.Ε.',
      initialWeightKg: 200,
      cleanLossPercent: 25,
      glazingPercent: 20,
      buyPricePerKg: 8.0,
      finalCostPerKg: 9.85,
      sellingPricePerKg: 13.0,
      estimatedProfitPercent: 24.2
    },
  ]);

  const suppliers = Array.from(new Set(batches.map(b => b.supplier)));

  const calculateBatchCosts = (batch: typeof newBatch) => {
    const netWeight = batch.initialWeightKg * (1 - batch.cleanLossPercent / 100);
    const finalWeight = netWeight * (1 + batch.glazingPercent / 100);
    const finalCostPerKg = (batch.buyPricePerKg * batch.initialWeightKg) / finalWeight;
    const sellingPricePerKg = finalCostPerKg * 1.3; // 30% markup
    const estimatedProfitPercent = ((sellingPricePerKg - finalCostPerKg) / sellingPricePerKg) * 100;

    return {
      finalCostPerKg,
      sellingPricePerKg,
      estimatedProfitPercent
    };
  };

  const handleAddBatch = () => {
    const costs = calculateBatchCosts(newBatch);
    const newBatchData: BatchData = {
      id: Date.now().toString(),
      ...newBatch,
      ...costs
    };

    setBatches(prev => [newBatchData, ...prev]);
    setNewBatch({
      date: '',
      product: '',
      supplier: '',
      initialWeightKg: 0,
      cleanLossPercent: 20,
      glazingPercent: 15,
      buyPricePerKg: 0,
    });
    setIsDialogOpen(false);
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = filterSupplier === 'all' || batch.supplier === filterSupplier;
    return matchesSearch && matchesSupplier;
  });

  const handleExportCSV = () => {
    const headers = ['Date', 'Product', 'Supplier', 'Initial Weight (kg)', 'Clean Loss %', 'Glazing %', 'Buy Price/kg', 'Final Cost/kg', 'Selling Price/kg', 'Profit %'];
    const csvContent = [
      headers.join(','),
      ...filteredBatches.map(batch => [
        batch.date,
        batch.product,
        batch.supplier,
        batch.initialWeightKg,
        batch.cleanLossPercent,
        batch.glazingPercent,
        batch.buyPricePerKg,
        batch.finalCostPerKg.toFixed(2),
        batch.sellingPricePerKg.toFixed(2),
        batch.estimatedProfitPercent.toFixed(1)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batches.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'gr' ? 'Διαχείριση Παρτίδων' : 'Batch Management'}
          </h2>
          <p className="text-gray-600">
            {language === 'gr' ? 'Προσθέστε και διαχειριστείτε τις παρτίδες σας' : 'Add and manage your batches'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExportCSV} variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>{language === 'gr' ? 'Εξαγωγή CSV' : 'Export CSV'}</span>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>{language === 'gr' ? 'Νέα Παρτίδα' : 'New Batch'}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {language === 'gr' ? 'Προσθήκη Νέας Παρτίδας' : 'Add New Batch'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="date">{language === 'gr' ? 'Ημερομηνία' : 'Date'}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newBatch.date}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="product">{language === 'gr' ? 'Προϊόν' : 'Product'}</Label>
                  <Input
                    id="product"
                    value={newBatch.product}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, product: e.target.value }))}
                    placeholder={language === 'gr' ? 'π.χ. Θράψαλο Block' : 'e.g. Cod Block'}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">{language === 'gr' ? 'Προμηθευτής' : 'Supplier'}</Label>
                  <Input
                    id="supplier"
                    value={newBatch.supplier}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, supplier: e.target.value }))}
                    placeholder={language === 'gr' ? 'π.χ. Αιγαίο Α.Ε.' : 'e.g. Ocean Ltd'}
                  />
                </div>
                <div>
                  <Label htmlFor="initialWeight">{language === 'gr' ? 'Αρχικό Βάρος (kg)' : 'Initial Weight (kg)'}</Label>
                  <Input
                    id="initialWeight"
                    type="number"
                    value={newBatch.initialWeightKg}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, initialWeightKg: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cleanLoss">{language === 'gr' ? 'Απώλεια Καθαρισμού (%)' : 'Clean Loss (%)'}</Label>
                  <Input
                    id="cleanLoss"
                    type="number"
                    value={newBatch.cleanLossPercent}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, cleanLossPercent: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="glazing">{language === 'gr' ? 'Γλασσάρισμα (%)' : 'Glazing (%)'}</Label>
                  <Input
                    id="glazing"
                    type="number"
                    value={newBatch.glazingPercent}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, glazingPercent: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="buyPrice">{language === 'gr' ? 'Τιμή Αγοράς/kg (€)' : 'Buy Price/kg (€)'}</Label>
                  <Input
                    id="buyPrice"
                    type="number"
                    step="0.01"
                    value={newBatch.buyPricePerKg}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, buyPricePerKg: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {language === 'gr' ? 'Ακύρωση' : 'Cancel'}
                </Button>
                <Button onClick={handleAddBatch}>
                  {language === 'gr' ? 'Προσθήκη' : 'Add'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'gr' ? 'Αναζήτηση προϊόντων ή προμηθευτών...' : 'Search products or suppliers...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterSupplier} onValueChange={setFilterSupplier}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={language === 'gr' ? 'Προμηθευτής' : 'Supplier'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'gr' ? 'Όλοι οι προμηθευτές' : 'All suppliers'}</SelectItem>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'gr' ? 'Παρτίδες' : 'Batches'} ({filteredBatches.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">{language === 'gr' ? 'Ημερομηνία' : 'Date'}</th>
                  <th className="text-left p-3">{language === 'gr' ? 'Προϊόν' : 'Product'}</th>
                  <th className="text-left p-3">{language === 'gr' ? 'Προμηθευτής' : 'Supplier'}</th>
                  <th className="text-right p-3">{language === 'gr' ? 'Αρχικό Βάρος' : 'Initial Weight'}</th>
                  <th className="text-right p-3">{language === 'gr' ? 'Κόστος/Kg' : 'Cost/Kg'}</th>
                  <th className="text-right p-3">{language === 'gr' ? 'Πώληση/Kg' : 'Selling/Kg'}</th>
                  <th className="text-right p-3">{language === 'gr' ? 'Κέρδος %' : 'Profit %'}</th>
                  <th className="text-center p-3">{language === 'gr' ? 'Ενέργειες' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => (
                  <tr key={batch.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{batch.date}</td>
                    <td className="p-3 font-medium">{batch.product}</td>
                    <td className="p-3">{batch.supplier}</td>
                    <td className="p-3 text-right">{batch.initialWeightKg}kg</td>
                    <td className="p-3 text-right">€{batch.finalCostPerKg.toFixed(2)}</td>
                    <td className="p-3 text-right">€{batch.sellingPricePerKg.toFixed(2)}</td>
                    <td className="p-3 text-right">
                      <Badge variant={batch.estimatedProfitPercent >= 20 ? "default" : "destructive"}>
                        {batch.estimatedProfitPercent.toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchManagement;
