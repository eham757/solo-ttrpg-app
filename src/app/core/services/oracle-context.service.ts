import { Injectable, effect, signal } from '@angular/core';

const ENTITIES_KEY = 'solo-ttrpg.oracle.entities';
const PLOTS_KEY = 'solo-ttrpg.oracle.plots';

@Injectable({ providedIn: 'root' })
export class OracleContextService {
  private readonly _entities = signal<string[]>(this.readList(ENTITIES_KEY, ['Player character']));
  private readonly _plots = signal<string[]>(this.readList(PLOTS_KEY, ['Escape current danger']));

  readonly entities = this._entities.asReadonly();
  readonly plots = this._plots.asReadonly();

  constructor() {
    effect(() => {
      this.writeList(ENTITIES_KEY, this._entities());
    });

    effect(() => {
      this.writeList(PLOTS_KEY, this._plots());
    });
  }

  public addEntity(value: string): void {
    const normalized = value.trim();
    if (!normalized) {
      return;
    }

    this._entities.update((items) => {
      if (items.includes(normalized)) {
        return items;
      }
      return [...items, normalized];
    });
  }

  public removeEntity(index: number): void {
    this._entities.update((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }

  public addPlot(value: string): void {
    const normalized = value.trim();
    if (!normalized) {
      return;
    }

    this._plots.update((items) => {
      if (items.includes(normalized)) {
        return items;
      }
      return [...items, normalized];
    });
  }

  public removePlot(index: number): void {
    this._plots.update((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }

  public getState(): { entities: string[]; plots: string[] } {
    return {
      entities: this._entities(),
      plots: this._plots(),
    };
  }

  public loadState(state: { entities: string[]; plots: string[] }): void {
    const safeEntities = this.normalizeList(state.entities, ['Player character']);
    const safePlots = this.normalizeList(state.plots, ['Escape current danger']);

    this._entities.set(safeEntities);
    this._plots.set(safePlots);
  }

  private readList(key: string, fallback: string[]): string[] {
    if (!this.canUseStorage()) {
      return fallback;
    }

    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return fallback;
      }

      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return fallback;
      }

      const list = parsed.filter((item): item is string => typeof item === 'string').map((item) => item.trim());
      const cleaned = list.filter((item) => item.length > 0);
      return cleaned.length > 0 ? cleaned : fallback;
    } catch {
      return fallback;
    }
  }

  private writeList(key: string, value: string[]): void {
    if (!this.canUseStorage()) {
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage write failures.
    }
  }

  private canUseStorage(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private normalizeList(input: string[], fallback: string[]): string[] {
    if (!Array.isArray(input)) {
      return fallback;
    }

    const cleaned = input
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item, index, arr) => item.length > 0 && arr.indexOf(item) === index);

    return cleaned.length > 0 ? cleaned : fallback;
  }
}
