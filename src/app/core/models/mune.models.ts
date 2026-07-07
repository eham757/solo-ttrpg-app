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

export type TweneResultType =
  | 'Increase simple element'
  | 'Decrease simple element'
  | 'Add simple element'
  | 'Remove simple element'
  | 'Increase major element'
  | 'Decrease major element'
  | 'Add major element'
  | 'Remove major element'
  | 'Wild positive'
  | 'Wild negative';

export interface TweneRoll {
  die: number;
  result: TweneResultType;
  guidance: string;
}

export interface OracleRollResult {
  entryType: 'oracle' | 'prompt' | 'twene';
  question: string;
  likelihood: LikelihoodMode;
  dice: number[];
  selectedDie: number;
  outcome: OracleOutcome;
  interventionPointGain: number;
  interventionPointsAfterRoll: number;
  intervention: InterventionEvent | null;
  createdAt: string;
  promptWords?: string[];
  tweneRoll?: TweneRoll;
}

export interface InterventionEvent {
  typeDie: number;
  type: InterventionType;
  notes: string;
  createdAt: string;
}
