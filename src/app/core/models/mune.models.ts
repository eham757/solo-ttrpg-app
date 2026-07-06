export type LikelihoodMode = 'normal' | 'likely' | 'unlikely';

export type OracleOutcome =
  | 'No and'
  | 'No'
  | 'No but'
  | 'Yes but'
  | 'Yes'
  | 'Yes and';

export type InterventionType =
  | 'New entity'
  | 'Entity positive'
  | 'Entity negative'
  | 'Advance plot'
  | 'Regress plot'
  | 'Wild';

export interface OracleRollResult {
  question: string;
  likelihood: LikelihoodMode;
  dice: number[];
  selectedDie: number;
  outcome: OracleOutcome;
  interventionPointGain: number;
  interventionPointsAfterRoll: number;
  intervention: InterventionEvent | null;
  createdAt: string;
}

export interface InterventionEvent {
  typeDie: number;
  type: InterventionType;
  notes: string;
  createdAt: string;
}
