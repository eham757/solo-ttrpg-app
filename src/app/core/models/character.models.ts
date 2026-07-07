export type CharacterFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'select'
  | 'stringList'
  | 'spellbook';

export interface SpellbookSectionSchema {
  id: string;
  label: string;
  placeholder?: string;
}

export type SpellbookValue = Record<string, string[]>;

export type CharacterValue = string | number | boolean | string[] | SpellbookValue;

export interface CharacterFieldSchema {
  id: string;
  label: string;
  type: CharacterFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  defaultValue?: CharacterValue;
  min?: number;
  max?: number;
  sections?: SpellbookSectionSchema[];
}

export interface CharacterSchema {
  name: string;
  version: string;
  description?: string;
  fields: CharacterFieldSchema[];
}

export interface CharacterDocument {
  schemaName: string;
  schemaVersion: string;
  values: Record<string, CharacterValue>;
}
