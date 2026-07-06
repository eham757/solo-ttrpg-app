import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CharacterFieldSchema,
  CharacterSchema,
  CharacterValue,
} from '../../core/models/character.models';
import { CharacterSheetService } from '../../core/services/character-sheet.service';

@Component({
  selector: 'app-character-sheet-page',
  imports: [FormsModule],
  templateUrl: './character-sheet-page.html',
  styleUrl: './character-sheet-page.css',
})
export class CharacterSheetPage {
  schema = signal<CharacterSchema | null>(null);
  values = signal<Record<string, CharacterValue>>({});
  errors = signal<string[]>([]);
  info = signal<string>('');

  readonly hasSchema = computed(() => this.schema() !== null);

  constructor(private readonly sheetService: CharacterSheetService) {}

  public async onSchemaSelected(event: Event): Promise<void> {
    const file = this.getFirstFile(event);
    if (!file) {
      return;
    }

    const rawJson = await file.text();
    const parsed = this.sheetService.parseSchema(rawJson);
    if (!parsed.data) {
      this.errors.set(parsed.errors);
      this.info.set('');
      return;
    }

    this.schema.set(parsed.data);
    this.values.set(this.sheetService.createDefaultValues(parsed.data));
    this.errors.set([]);
    this.info.set(`Loaded schema: ${parsed.data.name} (${parsed.data.version})`);
  }

  public async onCharacterSelected(event: Event): Promise<void> {
    const activeSchema = this.schema();
    if (!activeSchema) {
      this.errors.set(['Load a schema file before importing a character.']);
      this.info.set('');
      return;
    }

    const file = this.getFirstFile(event);
    if (!file) {
      return;
    }

    const rawJson = await file.text();
    const parsed = this.sheetService.parseCharacterDocument(rawJson, activeSchema);
    if (!parsed.data) {
      this.errors.set(parsed.errors);
      this.info.set('');
      return;
    }

    this.values.set(parsed.data.values);
    this.errors.set([]);
    this.info.set('Character file loaded.');
  }

  public updateField(field: CharacterFieldSchema, value: string | number | boolean): void {
    this.values.update((state) => {
      const nextState = { ...state };

      if (field.type === 'number') {
        const parsed = Number(value);
        nextState[field.id] = Number.isFinite(parsed) ? parsed : 0;
        return nextState;
      }

      if (field.type === 'boolean') {
        nextState[field.id] = Boolean(value);
        return nextState;
      }

      if (field.type === 'stringList') {
        const items = String(value)
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
        nextState[field.id] = items;
        return nextState;
      }

      nextState[field.id] = String(value);
      return nextState;
    });
  }

  public valueAsText(field: CharacterFieldSchema): string {
    const value = this.values()[field.id];
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }

    return value === undefined ? '' : String(value);
  }

  public valueAsBoolean(field: CharacterFieldSchema): boolean {
    return this.values()[field.id] === true;
  }

  public exportCharacter(): void {
    const activeSchema = this.schema();
    if (!activeSchema) {
      this.errors.set(['Cannot export without a loaded schema.']);
      this.info.set('');
      return;
    }

    const payload = this.sheetService.exportCharacterDocument(activeSchema, this.values());
    const content = JSON.stringify(payload, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeSchema.name.toLowerCase().replace(/\s+/g, '-')}-character.json`;
    link.click();
    URL.revokeObjectURL(url);

    this.errors.set([]);
    this.info.set('Character exported to JSON.');
  }

  private getFirstFile(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return null;
    }

    return input.files[0];
  }
}
