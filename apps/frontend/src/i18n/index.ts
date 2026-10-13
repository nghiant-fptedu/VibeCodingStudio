import { vi } from './translations/vi';
import { en } from './translations/en';
import type { Language, Translations } from './types';

export * from './types';

export const translations: Record<Language, Translations> = {
  vi,
  en,
};

export const getInitialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('vibespace_language');
    if (saved === 'vi' || saved === 'en') {
      return saved;
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language.toLowerCase().startsWith('vi') ? 'vi' : 'en';
    }
  } catch (err) {
    console.warn('Lỗi khi đọc ngôn ngữ từ localStorage:', err);
  }
  return 'vi';
};
