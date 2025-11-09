
import React from 'react';
import { Medication } from '../types';
import { InfoIcon, DosageIcon, SideEffectsIcon, WarningIcon } from './Icons';

interface MedicationInfoProps {
  medication: Medication;
  imageUrl: string;
  onReset: () => void;
}

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
            <div className="text-sky-500">{icon}</div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        </div>
        <div className="pl-8 text-slate-600 dark:text-slate-300">
            {children}
        </div>
    </div>
);

export const MedicationInfo: React.FC<MedicationInfoProps> = ({ medication, imageUrl, onReset }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{medication.name}</h2>
        <button 
          onClick={onReset} 
          className="text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors">
          Start Over
        </button>
      </div>

      <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
        <img src={imageUrl} alt={medication.name} className="max-w-full max-h-full object-contain" />
      </div>

      <div className="space-y-4">
        <InfoCard title="Description" icon={<InfoIcon className="h-5 w-5" />}>
            <p>{medication.description}</p>
        </InfoCard>

        <InfoCard title="Dosage" icon={<DosageIcon className="h-5 w-5" />}>
            <p>{medication.dosage}</p>
        </InfoCard>

        <InfoCard title="Common Side Effects" icon={<SideEffectsIcon className="h-5 w-5" />}>
            <ul className="list-disc list-inside space-y-1">
                {medication.sideEffects.map((effect, index) => <li key={index}>{effect}</li>)}
            </ul>
        </InfoCard>

        <InfoCard title="Warnings" icon={<WarningIcon className="h-5 w-5" />}>
            <ul className="list-disc list-inside space-y-1">
                {medication.warnings.map((warning, index) => <li key={index}>{warning}</li>)}
            </ul>
        </InfoCard>
      </div>
    </div>
  );
};
