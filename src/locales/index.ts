import { pt } from './pt';
import { en } from './en';
import { de } from './de';

export const translations = {
  pt,
  en,
  de,
} as const;

export type LanguageCode = keyof typeof translations;
