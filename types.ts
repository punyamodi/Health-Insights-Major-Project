
export enum MedicalSpecialty {
  Cardiologist = 'Cardiologist',
  Psychologist = 'Psychologist',
  Pulmonologist = 'Pulmonologist',
  Neurologist = 'Neurologist',
  Endocrinologist = 'Endocrinologist',
  Immunologist = 'Immunologist',
  Gastroenterologist = 'Gastroenterologist',
  Nephrologist = 'Nephrologist',
  Hematologist = 'Hematologist',
  Oncologist = 'Oncologist',
  Radiologist = 'Radiologist',
}

export interface Agent {
  name: MedicalSpecialty;
  description: string;
}

export interface SpecialistAnalysis {
  keyFindings: string[];
  potentialConditions: string[];
  recommendations: string[];
}

export interface SpecialistReport {
  specialty: MedicalSpecialty;
  analysis: SpecialistAnalysis | string | null;
  status: 'pending' | 'loading' | 'complete' | 'error';
}

export type FinalReport = {
  summary: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
};

export interface PatientHistory {
  pastDiagnoses: string;
  chronicConditions: string;
  allergies: string;
  currentMedications: string;
  familyHistory: string;
  lifestyleFactors: string;
}
