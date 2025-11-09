
export interface Medication {
  name: string;
  description: string;
  dosage: string;
  sideEffects: string[];
  warnings: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
