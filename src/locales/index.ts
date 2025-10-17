import { pt } from './pt';
import { en } from './en';
import { de } from './de';
import { zh } from './zh';

export const translations = {
  pt,
  en,
  de,
  zh,
} as const;

export type LanguageCode = keyof typeof translations;
