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
}
