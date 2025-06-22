
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const getSupportedLanguages = () => {
    return [
      // Langues européennes
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
      { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
      { code: 'pl', name: 'Polski', flag: '🇵🇱' },
      { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
      { code: 'no', name: 'Norsk', flag: '🇳🇴' },
      { code: 'da', name: 'Dansk', flag: '🇩🇰' },
      { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
      { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
      { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
      { code: 'ro', name: 'Română', flag: '🇷🇴' },
      { code: 'bg', name: 'Български', flag: '🇧🇬' },
      { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
      { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
      { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
      { code: 'et', name: 'Eesti', flag: '🇪🇪' },
      { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
      { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
      { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
      { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
      
      // Langues asiatiques
      { code: 'zh', name: '中文', flag: '🇨🇳' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
      { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
      { code: 'th', name: 'ไทย', flag: '🇹🇭' },
      { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
      { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
      { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
      { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
      { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
      { code: 'ur', name: 'اردو', flag: '🇵🇰' },
      { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
      { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
      { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
      { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
      { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
      { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
      { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
      { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
      { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
      { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭' },
      { code: 'lo', name: 'ລາວ', flag: '🇱🇦' },
      { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
      { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
      { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
      { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
      { code: 'ky', name: 'Кыргызча', flag: '🇰🇬' },
      { code: 'uz', name: 'O\'zbek', flag: '🇺🇿' },
      { code: 'tg', name: 'Тоҷикӣ', flag: '🇹🇯' },
      { code: 'tk', name: 'Türkmen', flag: '🇹🇲' },
      { code: 'mn', name: 'Монгол', flag: '🇲🇳' },
      
      // Langues du Moyen-Orient et d'Afrique du Nord
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'he', name: 'עברית', flag: '🇮🇱' },
      { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
      { code: 'ku', name: 'کوردی', flag: '🏴' },
      
      // Langues africaines
      { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
      { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
      { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
      { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
      { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
      { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
      { code: 'xh', name: 'isiXhosa', flag: '🇿🇦' },
      { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
      { code: 'so', name: 'Soomaali', flag: '🇸🇴' },
      { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
      { code: 'mg', name: 'Malagasy', flag: '🇲🇬' },
      
      // Langues des Amériques
      { code: 'qu', name: 'Quechua', flag: '🇵🇪' },
      { code: 'gn', name: 'Guaraní', flag: '🇵🇾' },
      { code: 'ht', name: 'Kreyòl Ayisyen', flag: '🇭🇹' },
      
      // Langues d'Océanie
      { code: 'mi', name: 'Te Reo Māori', flag: '🇳🇿' },
      { code: 'fj', name: 'Na Vosa Vakaviti', flag: '🇫🇯' },
      { code: 'sm', name: 'Gagana Sāmoa', flag: '🇼🇸' },
      { code: 'to', name: 'Lea Fakatonga', flag: '🇹🇴' },
      
      // Autres langues importantes
      { code: 'eo', name: 'Esperanto', flag: '🌍' },
      { code: 'la', name: 'Latina', flag: '🏛️' },
    ];
  };

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    currentLanguage: getCurrentLanguage(),
  };
};
