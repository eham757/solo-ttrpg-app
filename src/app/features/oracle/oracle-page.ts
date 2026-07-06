import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LikelihoodMode, OracleRollResult } from '../../core/models/mune.models';
import { OracleService } from '../../core/services/oracle.service';
import { OracleContextService } from '../../core/services/oracle-context.service';

interface OracleStateFile {
  version: 1;
  exportedAt: string;
  oracle: {
    interventionPoints: number;
    history: OracleRollResult[];
  };
  context: {
    entities: string[];
    plots: string[];
  };
}

@Component({
  selector: 'app-oracle-page',
  imports: [FormsModule, DatePipe],
  templateUrl: './oracle-page.html',
  styleUrl: './oracle-page.css',
})
export class OraclePage {
  private readonly oracleContext = inject(OracleContextService);

  question = signal<string>('');
  likelihood = signal<LikelihoodMode>('normal');
  latestResult = signal<OracleRollResult | null>(null);
  entityInput = signal<string>('');
  plotInput = signal<string>('');
  readonly entities = this.oracleContext.entities;
  readonly plots = this.oracleContext.plots;

  interventionEntitySuggestion = signal<string | null>(null);
  interventionPlotSuggestion = signal<string | null>(null);
  importExportMessage = signal<string>('');

  constructor(public readonly oracleService: OracleService) {}

  public askOracle(): void {
    const text = this.question().trim();
    if (!text) {
      return;
    }

    const result = this.oracleService.rollOracle(text, this.likelihood());
    this.latestResult.set(result);

    if (result.intervention) {
      this.interventionEntitySuggestion.set(this.pickRandom(this.entities()));
      this.interventionPlotSuggestion.set(this.pickRandom(this.plots()));
    } else {
      this.interventionEntitySuggestion.set(null);
      this.interventionPlotSuggestion.set(null);
    }
  }

  public setLikelihood(mode: LikelihoodMode): void {
    this.likelihood.set(mode);
  }

  public resetSession(): void {
    this.oracleService.resetSession();
    this.latestResult.set(null);
    this.interventionEntitySuggestion.set(null);
    this.interventionPlotSuggestion.set(null);
    this.importExportMessage.set('Session reset.');
  }

  public clearHistory(): void {
    this.oracleService.clearHistory();
    this.latestResult.set(null);
    this.importExportMessage.set('History cleared.');
  }

  public exportState(): void {
    const state: OracleStateFile = {
      version: 1,
      exportedAt: new Date().toISOString(),
      oracle: this.oracleService.getSessionState(),
      context: this.oracleContext.getState(),
    };

    const payload = JSON.stringify(state, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'solo-ttrpg-oracle-state.json';
    link.click();
    URL.revokeObjectURL(url);

    this.importExportMessage.set('State exported to JSON.');
  }

  public async onStateFileSelected(event: Event): Promise<void> {
    const file = this.getFirstFile(event);
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<OracleStateFile>;

      if (!parsed.oracle || !parsed.context) {
        this.importExportMessage.set('Invalid state file: missing oracle/context data.');
        return;
      }

      this.oracleService.loadSessionState({
        interventionPoints: parsed.oracle.interventionPoints ?? 0,
        history: Array.isArray(parsed.oracle.history) ? parsed.oracle.history : [],
      });

      this.oracleContext.loadState({
        entities: Array.isArray(parsed.context.entities) ? parsed.context.entities : [],
        plots: Array.isArray(parsed.context.plots) ? parsed.context.plots : [],
      });

      this.latestResult.set(this.oracleService.history()[0] ?? null);
      this.interventionEntitySuggestion.set(null);
      this.interventionPlotSuggestion.set(null);
      this.importExportMessage.set('State loaded from JSON.');
    } catch {
      this.importExportMessage.set('Could not parse state JSON file.');
    }
  }

  public addEntity(): void {
    const value = this.entityInput().trim();
    if (!value) {
      return;
    }

    this.oracleContext.addEntity(value);
    this.entityInput.set('');
  }

  public removeEntity(index: number): void {
    this.oracleContext.removeEntity(index);
  }

  public addPlot(): void {
    const value = this.plotInput().trim();
    if (!value) {
      return;
    }

    this.oracleContext.addPlot(value);
    this.plotInput.set('');
  }

  public removePlot(index: number): void {
    this.oracleContext.removePlot(index);
  }

  public rerollEntitySuggestion(): void {
    this.interventionEntitySuggestion.set(this.pickRandom(this.entities()));
  }

  public rerollPlotSuggestion(): void {
    this.interventionPlotSuggestion.set(this.pickRandom(this.plots()));
  }

  private pickRandom(items: string[]): string | null {
    if (items.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }

  private getFirstFile(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return null;
    }

    return input.files[0];
  }
}
