// src/i18n.js
import i18n from './frontend/node_modules/i18next';
import { initReactI18next } from './frontend/node_modules/react-i18next';
import LanguageDetector from './frontend/node_modules/i18next-browser-languagedetector';

// Para adicionar mais idiomas, fazer import e acrescentar no resources
// Adicionar também const t no início de cada função que envolve tradução

import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';
import translationLV from './locales/lv/translation.json';
import translationES from './locales/es/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      pt: { translation: translationPT },
	  lv: { translation: translationLV },
	  es: { translation: translationES }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
