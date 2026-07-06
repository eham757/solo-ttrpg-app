export type CharacterFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'select'
  | 'stringList';

export type CharacterValue = string | number | boolean | string[];

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
