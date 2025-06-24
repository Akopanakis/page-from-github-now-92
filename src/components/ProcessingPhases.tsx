import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Plus, Trash2, Crown, Scissors, Droplets, Snowflake } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProcessingPhase {
  id: string;
  name: string;
  wastePercentage: number;
  addedWeight: number;
  description: string;
}

interface ProcessingPhasesProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const ProcessingPhases: React.FC<ProcessingPhasesProps> = ({ formData, updateFormData }) => {
  const { language } = useLanguage();

  const addPhase = () => {
    const newPhase: ProcessingPhase = {
      id: Date.now().toString(),
      name: language === 'gr' ? 'Νέα Φάση' : 'New Phase',
      wastePercentage: 0,
      addedWeight: 0,
      description: ''
    };
    
    updateFormData({
      processingPhases: [...(formData.processingPhases || []), newPhase]
    });
  };

  const removePhase = (phaseId: string) => {
    updateFormData({
      processingPhases: (formData.processingPhases || []).filter((phase: ProcessingPhase) => phase.id !== phaseId)
    });
  };

  const updatePhase = (phaseId: string, updates: Partial<ProcessingPhase>) => {
    updateFormData({
      processingPhases: (formData.processingPhases || []).map((phase: ProcessingPhase) =>
        phase.id === phaseId ? { ...phase, ...updates } : phase
      )
    });
  };

  const getPhaseIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('καθάρισμα') || lowerName.includes('clean')) {
      return <Scissors className="w-4 h-4" />;
    }
    if (lowerName.includes('γλάσσο') || lowerName.includes('glaz')) {
      return <Droplets className="w-4 h-4" />;
    }
    if (lowerName.includes('πάγωμα') || lowerName.includes('freez')) {
      return <Snowflake className="w-4 h-4" />;
    }
    return <Settings className="w-4 h-4" />;
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
        <CardTitle className="flex items-center justify-between text-slate-800">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-purple-600" />
            <span>{language === 'gr' ? 'Φάσεις Επεξεργασίας' : 'Processing Phases'}</span>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="text-sm text-slate-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="font-medium text-blue-800 mb-1">
            {language === 'gr' ? '💡 Συμβουλή:' : '💡 Tip:'}
          </p>
          <p>
            {language === 'gr' 
              ? 'Ορίστε τις φάσεις επεξεργασίας με τη σειρά που εκτελούνται. Για κάθε φάση μπορείτε να ορίσετε απώλειες (%) ή προσθήκες βάρους (π.χ. γλάσσο).'
              : 'Define processing phases in the order they are executed. For each phase you can set losses (%) or weight additions (e.g. glazing).'
            }
          </p>
        </div>

        <div className="space-y-4">
          {(formData.processingPhases || []).map((phase: ProcessingPhase, index: number) => (
            <div key={phase.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getPhaseIcon(phase.name)}
                  <Badge variant="outline" className="text-xs">
                    {language === 'gr' ? 'Φάση' : 'Phase'} {index + 1}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removePhase(phase.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>{language === 'gr' ? 'Όνομα Φάσης' : 'Phase Name'}</Label>
                  <Input
                    value={phase.name}
                    onChange={(e) => updatePhase(phase.id, { name: e.target.value })}
                    placeholder={language === 'gr' ? 'π.χ. Καθάρισμα' : 'e.g. Cleaning'}
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{language === 'gr' ? 'Απώλεια (%)' : 'Waste (%)'}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={phase.wastePercentage}
                    onChange={(e) => updatePhase(phase.id, { wastePercentage: parseFloat(e.target.value) || 0 })}
                    placeholder="0.0"
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{language === 'gr' ? 'Προσθήκη Βάρους (%)' : 'Weight Addition (%)'}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={phase.addedWeight}
                    onChange={(e) => updatePhase(phase.id, { addedWeight: parseFloat(e.target.value) || 0 })}
                    placeholder="0.0"
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <div className="text-sm font-medium text-slate-700 mb-2">
                    {language === 'gr' ? 'Τελικό Αποτέλεσμα' : 'Net Effect'}
                  </div>
                  <div className="text-lg font-bold p-2 bg-gray-50 rounded border text-center">
                    {phase.wastePercentage > 0 ? `-${phase.wastePercentage}%` : ''}
                    {phase.wastePercentage > 0 && phase.addedWeight !== 0 ? ' ' : ''}
                    {phase.addedWeight > 0 ? `+${phase.addedWeight}%` : phase.addedWeight < 0 ? `${phase.addedWeight}%` : ''}
                    {phase.wastePercentage === 0 && phase.addedWeight === 0 ? '0%' : ''}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <Label>{language === 'gr' ? 'Περιγραφή' : 'Description'}</Label>
                <Textarea
                  value={phase.description}
                  onChange={(e) => updatePhase(phase.id, { description: e.target.value })}
                  placeholder={language === 'gr' 
                    ? 'Περιγράψτε τη διαδικασία αυτής της φάσης...'
                    : 'Describe the process of this phase...'
                  }
                  className="mt-2 border-slate-300 min-h-[60px]"
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={addPhase}
          variant="outline"
          className="w-full border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === 'gr' ? 'Προσθήκη Φάσης' : 'Add Phase'}
        </Button>

        {(formData.processingPhases || []).length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              {language === 'gr' ? 'Σύνοψη Επεξεργασίας' : 'Processing Summary'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">{language === 'gr' ? 'Σύνολο Φάσεων' : 'Total Phases'}</div>
                <div className="font-bold text-lg">{(formData.processingPhases || []).length}</div>
              </div>
              <div>
                <div className="text-gray-600">{language === 'gr' ? 'Συνολική Απώλεια' : 'Total Waste'}</div>
                <div className="font-bold text-lg text-red-600">
                  {(formData.processingPhases || [])
                    .reduce((sum: number, phase: ProcessingPhase) => sum + phase.wastePercentage, 0)
                    .toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-gray-600">{language === 'gr' ? 'Συνολική Προσθήκη' : 'Total Addition'}</div>
                <div className="font-bold text-lg text-green-600">
                  +{(formData.processingPhases || [])
                    .reduce((sum: number, phase: ProcessingPhase) => sum + Math.max(0, phase.addedWeight), 0)
                    .toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-gray-600">{language === 'gr' ? 'Καθαρό Αποτέλεσμα' : 'Net Result'}</div>
                <div className="font-bold text-lg">
                  {(() => {
                    const totalWaste = (formData.processingPhases || [])
                      .reduce((sum: number, phase: ProcessingPhase) => sum + phase.wastePercentage, 0);
                    const totalAddition = (formData.processingPhases || [])
                      .reduce((sum: number, phase: ProcessingPhase) => sum + phase.addedWeight, 0);
                    const net = totalAddition - totalWaste;
                    return net >= 0 ? `+${net.toFixed(1)}%` : `${net.toFixed(1)}%`;
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessingPhases;
