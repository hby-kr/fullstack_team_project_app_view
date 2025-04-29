import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// JSON 파일 가져오기
import translationEn from '../locales/en/translation.json';
import translationKo from '../locales/ko/translation.json';
import translationJa from '../locales/ja/translation.json';
import translationZh from '../locales/zh/translation.json';

i18n
    .use(LanguageDetector) // 브라우저 언어 감지
    .use(initReactI18next)  // react-i18next에 연결
    .init({
        resources: {
            en: { translation: translationEn },
            ko: { translation: translationKo },
            ja: { translation: translationJa },
            zh: { translation: translationZh },
        },
        fallbackLng: 'ko', // 못 찾으면 한국어 기본
        interpolation: {
            escapeValue: false, // react는 자동 XSS 방지됨
        },
    });

export default i18n;