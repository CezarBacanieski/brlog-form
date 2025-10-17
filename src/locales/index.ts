import { pt } from './pt';
import { en } from './en';

export const translations = {
  pt,
  en,
} as const;

export type LanguageCode = keyof typeof translations;
