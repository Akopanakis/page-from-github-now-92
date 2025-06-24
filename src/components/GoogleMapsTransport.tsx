
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Route, Navigation, Clock, Euro, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import TooltipHelper from './TooltipHelper';

interface GoogleMapsTransportProps {
  formData: any;
  updateFormData: (updates: any) => void;
}

const GoogleMapsTransport: React.FC<GoogleMapsTransportProps> = ({ formData, updateFormData }) => {
  const { t, language } = useLanguage();
  const [isCalculating, setIsCalculating] = useState(false);
  const [suggestions, setSuggestions] = useState<{origin: string[], destination: string[]}>({
    origin: [],
    destination: []
  });

  // Expanded Greek cities for better autocomplete
  const greekCities = [
    'Αθήνα, Ελλάδα', 'Θεσσαλονίκη, Ελλάδα', 'Πάτρα, Ελλάδα', 'Ηράκλειο, Ελλάδα',
    'Λάρισα, Ελλάδα', 'Βόλος, Ελλάδα', 'Ιωάννινα, Ελλάδα', 'Καβάλα, Ελλάδα',
    'Χανιά, Ελλάδα', 'Αγρίνιο, Ελλάδα', 'Νίκαια, Ελλάδα', 'Καλαμάτα, Ελλάδα',
    'Βέροια, Ελλάδα', 'Κομοτηνή, Ελλάδα', 'Σέρρες, Ελλάδα', 'Κοζάνη, Ελλάδα',
    'Ρόδος, Ελλάδα', 'Κέρκυρα, Ελλάδα', 'Κως, Ελλάδα', 'Μυτιλήνη, Ελλάδα',
    'Χίος, Ελλάδα', 'Αλεξανδρούπολη, Ελλάδα', 'Ξάνθη, Ελλάδα', 'Δράμα, Ελλάδα',
    'Φλώρινα, Ελλάδα', 'Καστοριά, Ελλάδα', 'Γρεβενά, Ελλάδα', 'Κιλκίς, Ελλάδα',
    'Τρίκαλα, Ελλάδα', 'Καρδίτσα, Ελλάδα', 'Λαμία, Ελλάδα', 'Χαλκίδα, Ελλάδα',
    'Λευκάδα, Ελλάδα', 'Ζάκυνθος, Ελλάδα', 'Κεφαλονιά, Ελλάδα', 'Πύργος, Ελλάδα',
    'Τρίπολη, Ελλάδα', 'Σπάρτη, Ελλάδα', 'Άργος, Ελλάδα', 'Ναύπλιο, Ελλάδα'
  ];

  const handleAddressChange = useCallback((field: 'origin' | 'destination', value: string) => {
    const fieldName = field === 'origin' ? 'originAddress' : 'destinationAddress';
    updateFormData({ [fieldName]: value });

    // Show suggestions
    if (value.length > 2) {
      const filtered = greekCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(prev => ({ ...prev, [field]: filtered }));
    } else {
      setSuggestions(prev => ({ ...prev, [field]: [] }));
    }
  }, [updateFormData]);

  const selectSuggestion = (field: 'origin' | 'destination', address: string) => {
    const fieldName = field === 'origin' ? 'originAddress' : 'destinationAddress';
    updateFormData({ [fieldName]: address });
    setSuggestions(prev => ({ ...prev, [field]: [] }));
  };

  const calculateRoute = async () => {
    if (!formData.originAddress || !formData.destinationAddress) {
      toast.error(
        language === 'gr' 
          ? 'Παρακαλώ εισάγετε και τις δύο διευθύνσεις' 
          : 'Please enter both addresses'
      );
      return;
    }

    setIsCalculating(true);
    
    try {
      // Simulate Google Maps API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Enhanced route calculation with more Greek routes
      const routes = {
        'Καβάλα-Θεσσαλονίκη': { distance: 162, tolls: 8.50, duration: '1.5 ώρες', fuelCost: 15.20 },
        'Αθήνα-Θεσσαλονίκη': { distance: 502, tolls: 22.40, duration: '5 ώρες', fuelCost: 45.50 },
        'Αθήνα-Πάτρα': { distance: 215, tolls: 12.20, duration: '2.5 ώρες', fuelCost: 19.80 },
        'Θεσσαλονίκη-Λάρισα': { distance: 155, tolls: 6.80, duration: '1.5 ώρες', fuelCost: 14.20 },
        'Αθήνα-Λαμία': { distance: 214, tolls: 11.50, duration: '2.2 ώρες', fuelCost: 19.50 },
        'Θεσσαλονίκη-Καβάλα': { distance: 162, tolls: 8.50, duration: '1.5 ώρες', fuelCost: 15.20 },
        'Πάτρα-Καλαμάτα': { distance: 145, tolls: 7.20, duration: '1.8 ώρες', fuelCost: 13.50 },
        'Ηράκλειο-Χανιά': { distance: 145, tolls: 0, duration: '1.5 ώρες', fuelCost: 13.50 },
        'Αθήνα-Βόλος': { distance: 326, tolls: 16.80, duration: '3.5 ώρες', fuelCost: 29.80 },
        'Θεσσαλονίκη-Ιωάννινα': { distance: 266, tolls: 14.20, duration: '2.8 ώρες', fuelCost: 24.50 },
        'default': { distance: 180, tolls: 9.50, duration: '2 ώρες', fuelCost: 16.50 }
      };

      // Improved route matching
      const origin = formData.originAddress.split(',')[0].trim();
      const destination = formData.destinationAddress.split(',')[0].trim();
      const routeKey = `${origin}-${destination}`;
      const reverseRouteKey = `${destination}-${origin}`;
      
      let routeData = routes[routeKey as keyof typeof routes] || 
                     routes[reverseRouteKey as keyof typeof routes];
      
      // If no exact match, calculate based on distance estimation
      if (!routeData) {
        // Simple distance estimation based on known coordinates (simplified)
        const cityCoords: { [key: string]: [number, number] } = {
          'Αθήνα': [37.9838, 23.7275],
          'Θεσσαλονίκη': [40.6401, 22.9444],
          'Πάτρα': [38.2466, 21.7346],
          'Λάρισα': [39.6368, 22.4194],
          'Καβάλα': [40.9396, 24.4027]
        };
        
        const originCoords = cityCoords[origin];
        const destCoords = cityCoords[destination];
        
        if (originCoords && destCoords) {
          // Haversine distance formula (simplified)
          const distance = Math.sqrt(
            Math.pow(destCoords[0] - originCoords[0], 2) + 
            Math.pow(destCoords[1] - originCoords[1], 2)
          ) * 111; // Rough km conversion
          
          routeData = {
            distance: Math.round(distance),
            tolls: distance * 0.05, // Estimate tolls
            duration: `${(distance / 80).toFixed(1)} ώρες`, // Estimate duration
            fuelCost: distance * 0.09 // Estimate fuel cost
          };
        } else {
          routeData = routes.default;
        }
      }
      
      updateFormData({
        distance: routeData.distance,
        tolls: routeData.tolls,
        routeCalculated: true,
        estimatedDuration: routeData.duration,
        fuelCost: routeData.fuelCost
      });
      
      toast.success(
        language === 'gr' 
          ? 'Η διαδρομή υπολογίστηκε επιτυχώς!' 
          : 'Route calculated successfully!'
      );
    } catch (error) {
      toast.error(
        language === 'gr' 
          ? 'Σφάλμα στον υπολογισμό της διαδρομής' 
          : 'Error calculating route'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>{language === 'gr' ? 'Στοιχεία Μεταφοράς' : 'Transport Details'}</span>
          <TooltipHelper tooltipKey="tooltip.google.maps" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Label className="flex items-center space-x-2">
              <Navigation className="w-4 h-4" />
              <span>{t('origin.address')}</span>
            </Label>
            <Input
              type="text"
              placeholder={language === 'gr' ? 'π.χ. Καβάλα, Ελλάδα' : 'e.g. Kavala, Greece'}
              value={formData.originAddress || ''}
              onChange={(e) => handleAddressChange('origin', e.target.value)}
              className="mt-2"
            />
            {suggestions.origin.length > 0 && (
              <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                {suggestions.origin.map((address, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100 last:border-b-0"
                    onClick={() => selectSuggestion('origin', address)}
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <span>{address}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Label className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{t('destination.address')}</span>
            </Label>
            <Input
              type="text"
              placeholder={language === 'gr' ? 'π.χ. Θεσσαλονίκη, Ελλάδα' : 'e.g. Thessaloniki, Greece'}
              value={formData.destinationAddress || ''}
              onChange={(e) => handleAddressChange('destination', e.target.value)}
              className="mt-2"
            />
            {suggestions.destination.length > 0 && (
              <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                {suggestions.destination.map((address, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100 last:border-b-0"
                    onClick={() => selectSuggestion('destination', address)}
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <span>{address}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={calculateRoute}
            disabled={isCalculating || !formData.originAddress || !formData.destinationAddress}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Route className="w-4 h-4" />
            <span>
              {isCalculating 
                ? (language === 'gr' ? 'Υπολογισμός...' : 'Calculating...') 
                : t('calculate.route')
              }
            </span>
          </Button>
        </div>

        {formData.routeCalculated && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
              <Route className="w-4 h-4" />
              <span>{language === 'gr' ? 'Αποτελέσματα Διαδρομής' : 'Route Results'}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <div>
                  <span className="text-green-600">{language === 'gr' ? 'Απόσταση:' : 'Distance:'}</span>
                  <span className="font-semibold ml-2">{formData.distance} km</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Euro className="w-4 h-4 text-green-600" />
                <div>
                  <span className="text-green-600">{language === 'gr' ? 'Διόδια:' : 'Tolls:'}</span>
                  <span className="font-semibold ml-2">{formData.tolls}€</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-600" />
                <div>
                  <span className="text-green-600">{language === 'gr' ? 'Διάρκεια:' : 'Duration:'}</span>
                  <span className="font-semibold ml-2">{formData.estimatedDuration}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="flex items-center space-x-2">
              <span>{t('distance')}</span>
              <TooltipHelper tooltipKey="tooltip.distance" />
            </Label>
            <Input
              type="number"
              step="0.1"
              placeholder="0.0"
              value={formData.distance || ''}
              onChange={(e) => updateFormData({ distance: parseFloat(e.target.value) || 0 })}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="flex items-center space-x-2">
              <span>{t('fuel.cost')}</span>
            </Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.fuelCost || ''}
              onChange={(e) => updateFormData({ fuelCost: parseFloat(e.target.value) || 0 })}
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="flex items-center space-x-2">
              <span>{language === 'gr' ? 'Διόδια (€)' : 'Tolls (€)'}</span>
            </Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.tolls || ''}
              onChange={(e) => updateFormData({ tolls: parseFloat(e.target.value) || 0 })}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="flex items-center space-x-2">
              <span>{t('parking.cost')}</span>
            </Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.parkingCost || ''}
              onChange={(e) => updateFormData({ parkingCost: parseFloat(e.target.value) || 0 })}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{language === 'gr' ? 'Μισθός Οδηγού (€)' : 'Driver Salary (€)'}</span>
              <TooltipHelper tooltipKey="tooltip.driver.salary" />
            </Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.driverSalary || ''}
              onChange={(e) => updateFormData({ driverSalary: parseFloat(e.target.value) || 0 })}
              className="mt-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsTransport;
