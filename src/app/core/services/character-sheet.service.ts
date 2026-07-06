import { Injectable } from '@angular/core';
import {
  CharacterDocument,
  CharacterFieldSchema,
  CharacterSchema,
  CharacterValue,
} from '../models/character.models';

interface ValidationResult<T> {
  data: T | null;
  errors: string[];
}

@Injectable({ providedIn: 'root' })
export class CharacterSheetService {
  public parseSchema(rawJson: string): ValidationResult<CharacterSchema> {
    try {
      const parsed = JSON.parse(rawJson) as Partial<CharacterSchema>;
      const errors = this.validateSchema(parsed);
      if (errors.length > 0) {
        return { data: null, errors };
      }

      return { data: parsed as CharacterSchema, errors: [] };
    } catch {
      return { data: null, errors: ['Invalid JSON in schema file.'] };
    }
  }

  public createDefaultValues(schema: CharacterSchema): Record<string, CharacterValue> {
    const values: Record<string, CharacterValue> = {};

    for (const field of schema.fields) {
      if (field.defaultValue !== undefined) {
        values[field.id] = field.defaultValue;
        continue;
      }

      values[field.id] = this.emptyValueForField(field);
    }

    return values;
  }

  public parseCharacterDocument(
    rawJson: string,
    schema: CharacterSchema,
  ): ValidationResult<CharacterDocument> {
    try {
      const parsed = JSON.parse(rawJson) as Partial<CharacterDocument>;
      if (!parsed.values || typeof parsed.values !== 'object') {
        return { data: null, errors: ['Character file must contain a values object.'] };
      }

      const normalizedValues: Record<string, CharacterValue> = this.createDefaultValues(schema);
      const errors: string[] = [];

      for (const field of schema.fields) {
        const incoming = (parsed.values as Record<string, unknown>)[field.id];
        if (incoming === undefined) {
          continue;
        }

        const normalized = this.normalizeValueForField(field, incoming);
        if (normalized === null) {
          errors.push(`Field "${field.label}" has an invalid value type.`);
          continue;
        }

        normalizedValues[field.id] = normalized;
      }

      if (errors.length > 0) {
        return { data: null, errors };
      }

      return {
        data: {
          schemaName: schema.name,
          schemaVersion: schema.version,
          values: normalizedValues,
        },
        errors: [],
      };
    } catch {
      return { data: null, errors: ['Invalid JSON in character file.'] };
    }
  }

  public exportCharacterDocument(
    schema: CharacterSchema,
    values: Record<string, CharacterValue>,
  ): CharacterDocument {
    return {
      schemaName: schema.name,
      schemaVersion: schema.version,
      values,
    };
  }

  private validateSchema(schema: Partial<CharacterSchema>): string[] {
    const errors: string[] = [];

    if (!schema.name || typeof schema.name !== 'string') {
      errors.push('Schema requires a string name.');
    }

    if (!schema.version || typeof schema.version !== 'string') {
      errors.push('Schema requires a string version.');
    }

    if (!Array.isArray(schema.fields) || schema.fields.length === 0) {
      errors.push('Schema requires a non-empty fields array.');
      return errors;
    }

    for (const field of schema.fields) {
      if (!field.id || typeof field.id !== 'string') {
        errors.push('Each field requires a string id.');
      }

      if (!field.label || typeof field.label !== 'string') {
        errors.push('Each field requires a string label.');
      }

      if (!field.type || typeof field.type !== 'string') {
        errors.push(`Field "${field.label ?? 'unknown'}" requires a type.`);
        continue;
      }

      if (!this.isAllowedType(field.type)) {
        errors.push(`Field "${field.label}" has unsupported type "${field.type}".`);
      }

      if (field.type === 'select' && (!Array.isArray(field.options) || field.options.length === 0)) {
        errors.push(`Field "${field.label}" of type select requires options.`);
      }
    }

    return errors;
  }

  private isAllowedType(type: string): boolean {
    return ['text', 'textarea', 'number', 'boolean', 'select', 'stringList'].includes(type);
  }

  private emptyValueForField(field: CharacterFieldSchema): CharacterValue {
    switch (field.type) {
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'stringList':
        return [];
      case 'select':
        return field.options?.[0] ?? '';
      default:
        return '';
    }
  }

  private normalizeValueForField(field: CharacterFieldSchema, value: unknown): CharacterValue | null {
    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'select':
        return typeof value === 'string' ? value : null;
      case 'number':
        if (typeof value === 'number' && Number.isFinite(value)) {
          return value;
        }
        if (typeof value === 'string') {
          const parsed = Number(value);
          return Number.isFinite(parsed) ? parsed : null;
        }
        return null;
      case 'boolean':
        return typeof value === 'boolean' ? value : null;
      case 'stringList':
        if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
          return value;
        }
        return null;
      default:
        return null;
    }
  }
}
