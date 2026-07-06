import { Injectable, signal } from '@angular/core';
import {
  InterventionEvent,
  InterventionType,
  LikelihoodMode,
  OracleOutcome,
  OracleRollResult,
} from '../models/mune.models';

const ORACLE_TABLE: Record<number, OracleOutcome> = {
  1: 'No and',
  2: 'No',
  3: 'No but',
  4: 'Yes but',
  5: 'Yes',
  6: 'Yes and',
};

const INTERVENTION_TABLE: Record<number, InterventionType> = {
  1: 'New entity',
  2: 'Entity positive',
  3: 'Entity negative',
  4: 'Advance plot',
  5: 'Regress plot',
  6: 'Wild',
};

const PROMPT_WORD_POOL: string[] = [
  'ancient', 'hidden', 'broken', 'sacred', 'wild', 'lonely', 'storm', 'shadow', 'ember', 'thorn',
  'river', 'forest', 'marsh', 'mountain', 'ruin', 'tower', 'village', 'temple', 'road', 'gate',
  'watcher', 'hunter', 'merchant', 'ghost', 'beast', 'bandit', 'knight', 'oracle', 'hermit', 'stranger',
  'home', 'memory', 'fear', 'hope', 'blood', 'gold', 'secret', 'oath', 'curse', 'truth',
  'pursuit', 'ambush', 'echo', 'whisper', 'signal', 'clue', 'loss', 'bargain', 'rescue', 'betrayal',
];

@Injectable({ providedIn: 'root' })
export class OracleService {
  private readonly _interventionPoints = signal<number>(0);
  private readonly _history = signal<OracleRollResult[]>([]);

  readonly interventionPoints = this._interventionPoints.asReadonly();
  readonly history = this._history.asReadonly();

  public clearHistory(): void {
    this._history.set([]);
  }

  public resetSession(): void {
    this._interventionPoints.set(0);
    this._history.set([]);
  }

  public getSessionState(): { interventionPoints: number; history: OracleRollResult[] } {
    return {
      interventionPoints: this._interventionPoints(),
      history: this._history(),
    };
  }

  public loadSessionState(state: { interventionPoints: number; history: OracleRollResult[] }): void {
    const safeInterventionPoints = Number.isFinite(state.interventionPoints)
      ? Math.max(0, Math.min(2, Math.floor(state.interventionPoints)))
      : 0;

    const safeHistory = Array.isArray(state.history) ? state.history : [];

    this._interventionPoints.set(safeInterventionPoints);
    this._history.set(safeHistory);
  }

  public rollOracle(question: string, likelihood: LikelihoodMode): OracleRollResult {
    const trimmedQuestion = question.trim();
    const dice = this.rollForLikelihood(likelihood);
    const selectedDie = this.selectDieByLikelihood(dice, likelihood);
    const outcome = ORACLE_TABLE[selectedDie];
    const interventionPointGain = dice.some((die) => die === 6) ? 1 : 0;
    let interventionPointsAfterRoll = this._interventionPoints() + interventionPointGain;
    let intervention: InterventionEvent | null = null;

    if (interventionPointsAfterRoll >= 3) {
      intervention = this.rollIntervention();
      interventionPointsAfterRoll = 0;
    }

    this._interventionPoints.set(interventionPointsAfterRoll);

    const result: OracleRollResult = {
      entryType: 'oracle',
      question: trimmedQuestion,
      likelihood,
      dice,
      selectedDie,
      outcome,
      interventionPointGain,
      interventionPointsAfterRoll,
      intervention,
      createdAt: new Date().toISOString(),
    };

    this._history.update((history) => [result, ...history]);

    return result;
  }

  public rollPrompt(question: string, wordCount = 3): OracleRollResult {
    const trimmedQuestion = question.trim();
    const count = Number.isFinite(wordCount) ? Math.max(1, Math.floor(wordCount)) : 3;
    const promptWords = this.pickPromptWords(count);

    const result: OracleRollResult = {
      entryType: 'prompt',
      question: trimmedQuestion,
      likelihood: 'normal',
      dice: [],
      selectedDie: 0,
      outcome: 'Yes',
      interventionPointGain: 0,
      interventionPointsAfterRoll: this._interventionPoints(),
      intervention: null,
      createdAt: new Date().toISOString(),
      promptWords,
    };

    this._history.update((history) => [result, ...history]);
    return result;
  }

  private rollIntervention(): InterventionEvent {
    const typeDie = this.rollD6();
    return {
      typeDie,
      type: INTERVENTION_TABLE[typeDie],
      notes: 'Interpret with your active entities/plots and optional Portent.',
      createdAt: new Date().toISOString(),
    };
  }

  private rollForLikelihood(likelihood: LikelihoodMode): number[] {
    if (likelihood === 'normal') {
      return [this.rollD6()];
    }

    return [this.rollD6(), this.rollD6()];
  }

  private selectDieByLikelihood(dice: number[], likelihood: LikelihoodMode): number {
    if (likelihood === 'likely') {
      return Math.max(...dice);
    }

    if (likelihood === 'unlikely') {
      return Math.min(...dice);
    }

    return dice[0];
  }

  private rollD6(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  private pickPromptWords(count: number): string[] {
    const unique = new Set<string>();
    while (unique.size < count) {
      const randomIndex = Math.floor(Math.random() * PROMPT_WORD_POOL.length);
      unique.add(PROMPT_WORD_POOL[randomIndex]);
    }
    return Array.from(unique);
  }
}
