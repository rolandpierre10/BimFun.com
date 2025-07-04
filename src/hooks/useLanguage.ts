
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
      // === EUROPE ===
      // Europe occidentale
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
      { code: 'ca', name: 'Català', flag: '🇪🇸' },
      { code: 'eu', name: 'Euskera', flag: '🇪🇸' },
      { code: 'gl', name: 'Galego', flag: '🇪🇸' },
      
      // Europe du Nord
      { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
      { code: 'no', name: 'Norsk', flag: '🇳🇴' },
      { code: 'da', name: 'Dansk', flag: '🇩🇰' },
      { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
      { code: 'is', name: 'Íslenska', flag: '🇮🇸' },
      { code: 'fo', name: 'Føroyskt', flag: '🇫🇴' },
      { code: 'se', name: 'Davvisámegiella', flag: '🇸🇪' },
      
      // Europe centrale
      { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
      { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
      { code: 'pl', name: 'Polski', flag: '🇵🇱' },
      { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
      { code: 'de-at', name: 'Österreichisches Deutsch', flag: '🇦🇹' },
      { code: 'de-ch', name: 'Schweizerdeutsch', flag: '🇨🇭' },
      
      // Europe orientale
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
      { code: 'uk', name: 'Українська', flag: '🇺🇦' },
      { code: 'be', name: 'Беларуская', flag: '🇧🇾' },
      { code: 'bg', name: 'Български', flag: '🇧🇬' },
      { code: 'ro', name: 'Română', flag: '🇷🇴' },
      { code: 'mo', name: 'Moldovenească', flag: '🇲🇩' },
      
      // Europe du Sud-Est
      { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
      { code: 'sr', name: 'Српски', flag: '🇷🇸' },
      { code: 'bs', name: 'Bosanski', flag: '🇧🇦' },
      { code: 'me', name: 'Crnogorski', flag: '🇲🇪' },
      { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
      { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
      { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
      
      // Pays baltes
      { code: 'et', name: 'Eesti', flag: '🇪🇪' },
      { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
      { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
      
      // Autres langues européennes
      { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
      { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
      { code: 'mt', name: 'Malti', flag: '🇲🇹' },
      { code: 'cy', name: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
      { code: 'ga', name: 'Gaeilge', flag: '🇮🇪' },
      { code: 'gd', name: 'Gàidhlig', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
      { code: 'br', name: 'Brezhoneg', flag: '🇫🇷' },
      { code: 'co', name: 'Corsu', flag: '🇫🇷' },
      { code: 'oc', name: 'Occitan', flag: '🇫🇷' },
      { code: 'rm', name: 'Rumantsch', flag: '🇨🇭' },
      { code: 'fur', name: 'Furlan', flag: '🇮🇹' },
      { code: 'sc', name: 'Sardu', flag: '🇮🇹' },
      { code: 'lij', name: 'Ligure', flag: '🇮🇹' },
      { code: 'vec', name: 'Vèneto', flag: '🇮🇹' },
      { code: 'nap', name: 'Napulitano', flag: '🇮🇹' },
      { code: 'scn', name: 'Sicilianu', flag: '🇮🇹' },
      
      // === ASIE ===
      // Asie de l'Est
      { code: 'zh', name: '中文 (简体)', flag: '🇨🇳' },
      { code: 'zh-tw', name: '中文 (繁體)', flag: '🇹🇼' },
      { code: 'zh-hk', name: '粵語', flag: '🇭🇰' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
      { code: 'mn', name: 'Монгол', flag: '🇲🇳' },
      
      // Asie du Sud-Est
      { code: 'th', name: 'ไทย', flag: '🇹🇭' },
      { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
      { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
      { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
      { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
      { code: 'ceb', name: 'Cebuano', flag: '🇵🇭' },
      { code: 'ilo', name: 'Ilokano', flag: '🇵🇭' },
      { code: 'pam', name: 'Kapampangan', flag: '🇵🇭' },
      { code: 'war', name: 'Waray', flag: '🇵🇭' },
      { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
      { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭' },
      { code: 'lo', name: 'ລາວ', flag: '🇱🇦' },
      { code: 'jv', name: 'Basa Jawa', flag: '🇮🇩' },
      { code: 'su', name: 'Basa Sunda', flag: '🇮🇩' },
      { code: 'min', name: 'Baso Minangkabau', flag: '🇮🇩' },
      { code: 'bug', name: 'Basa Ugi', flag: '🇮🇩' },
      { code: 'ban', name: 'Basa Bali', flag: '🇮🇩' },
      
      // Asie du Sud
      { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
      { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
      { code: 'ur', name: 'اردو', flag: '🇵🇰' },
      { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
      { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
      { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
      { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
      { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
      { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
      { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
      { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
      { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
      { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
      { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
      { code: 'dv', name: 'ދިވެހި', flag: '🇲🇻' },
      { code: 'ps', name: 'پښتو', flag: '🇦🇫' },
      { code: 'sd', name: 'سنڌي', flag: '🇵🇰' },
      { code: 'bho', name: 'भोजपुरी', flag: '🇮🇳' },
      { code: 'mai', name: 'मैथिली', flag: '🇮🇳' },
      { code: 'mag', name: 'मगही', flag: '🇮🇳' },
      { code: 'sa', name: 'संस्कृतम्', flag: '🇮🇳' },
      
      // Asie centrale
      { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
      { code: 'ky', name: 'Кыргызча', flag: '🇰🇬' },
      { code: 'uz', name: 'O\'zbek', flag: '🇺🇿' },
      { code: 'tg', name: 'Тоҷикӣ', flag: '🇹🇯' },
      { code: 'tk', name: 'Türkmen', flag: '🇹🇲' },
      
      // Caucase
      { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
      { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
      { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
      { code: 'ab', name: 'Аҧсуа бызшәа', flag: '🇬🇪' },
      { code: 'os', name: 'Ирон æвзаг', flag: '🇬🇪' },
      { code: 'ce', name: 'Нохчийн мотт', flag: '🇷🇺' },
      { code: 'av', name: 'Авар мацӏ', flag: '🇷🇺' },
      { code: 'lez', name: 'Лезги чӏал', flag: '🇷🇺' },
      
      // === MOYEN-ORIENT ===
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'he', name: 'עברית', flag: '🇮🇱' },
      { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
      { code: 'ku', name: 'کوردی', flag: '🏴' },
      { code: 'ckb', name: 'سۆرانی', flag: '🇮🇶' },
      { code: 'lrc', name: 'لۊری شومالی', flag: '🇮🇷' },
      { code: 'mzn', name: 'مازِرونی', flag: '🇮🇷' },
      { code: 'glk', name: 'گیلکی', flag: '🇮🇷' },
      { code: 'bal', name: 'بلۏچی', flag: '🇵🇰' },
      { code: 'pnb', name: 'پنجابی', flag: '🇵🇰' },
      
      // === AFRIQUE ===
      // Afrique du Nord
      { code: 'ar-ma', name: 'العربية المغربية', flag: '🇲🇦' },
      { code: 'ar-dz', name: 'العربية الجزائرية', flag: '🇩🇿' },
      { code: 'ar-tn', name: 'العربية التونسية', flag: '🇹🇳' },
      { code: 'ar-ly', name: 'العربية الليبية', flag: '🇱🇾' },
      { code: 'ar-eg', name: 'العربية المصرية', flag: '🇪🇬' },
      { code: 'ber', name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', flag: '🇲🇦' },
      { code: 'kab', name: 'Taqbaylit', flag: '🇩🇿' },
      { code: 'tzm', name: 'Tamaziɣt', flag: '🇲🇦' },
      
      // Afrique de l'Ouest
      { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
      { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
      { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
      { code: 'ff', name: 'Fulfulde', flag: '🇸🇳' },
      { code: 'wo', name: 'Wolof', flag: '🇸🇳' },
      { code: 'bm', name: 'Bamanankan', flag: '🇲🇱' },
      { code: 'dyu', name: 'Dioula', flag: '🇨🇮' },
      { code: 'ee', name: 'Eʋegbe', flag: '🇬🇭' },
      { code: 'tw', name: 'Twi', flag: '🇬🇭' },
      { code: 'ak', name: 'Akan', flag: '🇬🇭' },
      { code: 'gaa', name: 'Ga', flag: '🇬🇭' },
      { code: 'dag', name: 'Dagbani', flag: '🇬🇭' },
      { code: 'mos', name: 'Mooré', flag: '🇧🇫' },
      { code: 'kr', name: 'Kanuri', flag: '🇳🇬' },
      { code: 'nup', name: 'Nupe', flag: '🇳🇬' },
      { code: 'bin', name: 'Edo', flag: '🇳🇬' },
      { code: 'tiv', name: 'Tiv', flag: '🇳🇬' },
      { code: 'ibo', name: 'Ibibio', flag: '🇳🇬' },
      { code: 'efi', name: 'Efik', flag: '🇳🇬' },
      
      // Afrique centrale
      { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
      { code: 'ln', name: 'Lingála', flag: '🇨🇩' },
      { code: 'kg', name: 'Kikongo', flag: '🇨🇩' },
      { code: 'lua', name: 'Luba-Kasai', flag: '🇨🇩' },
      { code: 'luo', name: 'Dholuo', flag: '🇰🇪' },
      { code: 'lg', name: 'Luganda', flag: '🇺🇬' },
      { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
      { code: 'rn', name: 'Ikirundi', flag: '🇧🇮' },
      { code: 'sg', name: 'Sängö', flag: '🇨🇫' },
      
      // Afrique de l'Est
      { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
      { code: 'ti', name: 'ትግርኛ', flag: '🇪🇹' },
      { code: 'om', name: 'Afaan Oromoo', flag: '🇪🇹' },
      { code: 'so', name: 'Soomaali', flag: '🇸🇴' },
      { code: 'aa', name: 'Qafar af', flag: '🇪🇹' },
      { code: 'sid', name: 'Sidaamu afoo', flag: '🇪🇹' },
      { code: 'wal', name: 'Wolaytta', flag: '🇪🇹' },
      { code: 'gez', name: 'ግዕዝ', flag: '🇪🇹' },
      
      // Afrique australe
      { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
      { code: 'xh', name: 'isiXhosa', flag: '🇿🇦' },
      { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
      { code: 'st', name: 'Sesotho', flag: '🇿🇦' },
      { code: 'tn', name: 'Setswana', flag: '🇿🇦' },
      { code: 've', name: 'Tshivenḓa', flag: '🇿🇦' },
      { code: 'ts', name: 'Xitsonga', flag: '🇿🇦' },
      { code: 'ss', name: 'siSwati', flag: '🇿🇦' },
      { code: 'nr', name: 'isiNdebele', flag: '🇿🇦' },
      { code: 'nso', name: 'Sepedi', flag: '🇿🇦' },
      { code: 'sn', name: 'ChiShona', flag: '🇿🇼' },
      { code: 'nd', name: 'isiNdebele', flag: '🇿🇼' },
      { code: 'ny', name: 'Chichewa', flag: '🇲🇼' },
      
      // Autres langues africaines
      { code: 'mg', name: 'Malagasy', flag: '🇲🇬' },
      { code: 'ho', name: 'Hiri Motu', flag: '🇵🇬' },
      { code: 'tpi', name: 'Tok Pisin', flag: '🇵🇬' },
      
      // === AMÉRIQUES ===
      // Amérique du Nord
      { code: 'en-us', name: 'American English', flag: '🇺🇸' },
      { code: 'en-ca', name: 'Canadian English', flag: '🇨🇦' },
      { code: 'fr-ca', name: 'Français canadien', flag: '🇨🇦' },
      { code: 'es-mx', name: 'Español mexicano', flag: '🇲🇽' },
      { code: 'nah', name: 'Nahuatl', flag: '🇲🇽' },
      { code: 'yua', name: 'Maya', flag: '🇲🇽' },
      { code: 'myn', name: 'K\'iche\'', flag: '🇬🇹' },
      { code: 'iu', name: 'ᐃᓄᒃᑎᑐᑦ', flag: '🇨🇦' },
      { code: 'cr', name: 'ᓀᐦᐃᔭᐍᐏᐣ', flag: '🇨🇦' },
      { code: 'oj', name: 'Anishinaabemowin', flag: '🇨🇦' },
      { code: 'moh', name: 'Kanienʼkéha', flag: '🇨🇦' },
      { code: 'mic', name: 'Mi\'kmaq', flag: '🇨🇦' },
      { code: 'haw', name: 'ʻŌlelo Hawaiʻi', flag: '🇺🇸' },
      { code: 'nav', name: 'Diné bizaad', flag: '🇺🇸' },
      { code: 'lkt', name: 'Lakȟótiyapi', flag: '🇺🇸' },
      { code: 'chy', name: 'Tsėhésenėstsestȯtse', flag: '🇺🇸' },
      
      // Amérique centrale et Caraïbes
      { code: 'ht', name: 'Kreyòl Ayisyen', flag: '🇭🇹' },
      { code: 'jam', name: 'Patois', flag: '🇯🇲' },
      { code: 'pap', name: 'Papiamentu', flag: '🇦🇼' },
      { code: 'an', name: 'Aragonés', flag: '🇪🇸' },
      
      // Amérique du Sud
      { code: 'pt-br', name: 'Português brasileiro', flag: '🇧🇷' },
      { code: 'es-ar', name: 'Español rioplatense', flag: '🇦🇷' },
      { code: 'es-co', name: 'Español colombiano', flag: '🇨🇴' },
      { code: 'es-ve', name: 'Español venezolano', flag: '🇻🇪' },
      { code: 'es-pe', name: 'Español peruano', flag: '🇵🇪' },
      { code: 'es-cl', name: 'Español chileno', flag: '🇨🇱' },
      { code: 'qu', name: 'Runasimi', flag: '🇵🇪' },
      { code: 'ay', name: 'Aymar aru', flag: '🇧🇴' },
      { code: 'gn', name: 'Avañe\'ẽ', flag: '🇵🇾' },
      { code: 'jv', name: 'Wayuunaiki', flag: '🇨🇴' },
      { code: 'srn', name: 'Sranan Tongo', flag: '🇸🇷' },
      { code: 'gcr', name: 'Kriyòl gwiyanè', flag: '🇬🇫' },
      
      // === OCÉANIE ===
      { code: 'en-au', name: 'Australian English', flag: '🇦🇺' },
      { code: 'en-nz', name: 'New Zealand English', flag: '🇳🇿' },
      { code: 'mi', name: 'Te Reo Māori', flag: '🇳🇿' },
      { code: 'fj', name: 'Na Vosa Vakaviti', flag: '🇫🇯' },
      { code: 'sm', name: 'Gagana Sāmoa', flag: '🇼🇸' },
      { code: 'to', name: 'Lea Fakatonga', flag: '🇹🇴' },
      { code: 'ty', name: 'Reo Tahiti', flag: '🇵🇫' },
      { code: 'bi', name: 'Bislama', flag: '🇻🇺' },
      { code: 'ch', name: 'Chamoru', flag: '🇬🇺' },
      { code: 'gil', name: 'Taetae ni Kiribati', flag: '🇰🇮' },
      { code: 'mh', name: 'Kajin M̧ajeļ', flag: '🇲🇭' },
      { code: 'na', name: 'Dorerin Naoero', flag: '🇳🇷' },
      { code: 'pau', name: 'Tekoi ra Belau', flag: '🇵🇼' },
      { code: 'tvl', name: 'Te Ggana Tuuvalu', flag: '🇹🇻' },
      
      // === LANGUES CONSTRUITES ET AUTRES ===
      { code: 'eo', name: 'Esperanto', flag: '🌍' },
      { code: 'io', name: 'Ido', flag: '🌍' },
      { code: 'ia', name: 'Interlingua', flag: '🌍' },
      { code: 'ie', name: 'Interlingue', flag: '🌍' },
      { code: 'vo', name: 'Volapük', flag: '🌍' },
      { code: 'jbo', name: 'Lojban', flag: '🌍' },
      { code: 'tlh', name: 'tlhIngan Hol', flag: '🖖' },
      { code: 'art-lojban', name: 'Lojban', flag: '🌍' },
      
      // === LANGUES ANCIENNES ===
      { code: 'la', name: 'Latina', flag: '🏛️' },
      { code: 'grc', name: 'Ἀρχαία Ἑλληνική', flag: '🏛️' },
      { code: 'cop', name: 'ϯⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ', flag: '🏛️' },
      { code: 'got', name: '𐌲𐌿𐍄𐌹𐍃𐌺', flag: '🏛️' },
      { code: 'non', name: 'Norrœnt mál', flag: '🏛️' },
      { code: 'ang', name: 'Englisċ', flag: '🏛️' },
      { code: 'fro', name: 'François', flag: '🏛️' },
      { code: 'pro', name: 'Provençal', flag: '🏛️' },
      { code: 'gmh', name: 'Mittelhochdeutsch', flag: '🏛️' },
      { code: 'enm', name: 'Middle English', flag: '🏛️' },
      { code: 'akk', name: '𒀝𒅗𒁺𒌑', flag: '🏛️' },
      { code: 'sux', name: '𒅴𒂠', flag: '🏛️' },
      { code: 'egy', name: 'r n kmt', flag: '🏛️' },
      { code: 'phn', name: '𐤃𐤁𐤓𐤉𐤌 𐤊𐤍𐤏𐤍𐤉𐤌', flag: '🏛️' },
      { code: 'arc', name: 'ארמית', flag: '🏛️' },
      { code: 'syc', name: 'ܠܫܢܐ ܣܘܪܝܝܐ', flag: '🏛️' },
      { code: 'xmf', name: 'მარგალური ნინა', flag: '🇬🇪' },
      
      // === LANGUES RARES ET MINORITAIRES ===
      // Sibérie et Extrême-Orient russe
      { code: 'chm', name: 'Марий йылме', flag: '🇷🇺' },
      { code: 'udm', name: 'Удмурт кыл', flag: '🇷🇺' },
      { code: 'kv', name: 'Коми кыв', flag: '🇷🇺' },
      { code: 'koi', name: 'Перем коми', flag: '🇷🇺' },
      { code: 'mdf', name: 'Мокшень кяль', flag: '🇷🇺' },
      { code: 'myv', name: 'Эрзянь кель', flag: '🇷🇺' },
      { code: 'cv', name: 'Чӑваш чӗлхи', flag: '🇷🇺' },
      { code: 'tt', name: 'Татар теле', flag: '🇷🇺' },
      { code: 'ba', name: 'Башҡорт теле', flag: '🇷🇺' },
      { code: 'sah', name: 'Саха тыла', flag: '🇷🇺' },
      { code: 'tyv', name: 'Тыва дыл', flag: '🇷🇺' },
      { code: 'bua', name: 'Буряад хэлэн', flag: '🇷🇺' },
      { code: 'xal', name: 'Хальмг келн', flag: '🇷🇺' },
      { code: 'alt', name: 'Алтай тил', flag: '🇷🇺' },
      { code: 'kjh', name: 'Хакас тілі', flag: '🇷🇺' },
      { code: 'cjs', name: 'Шор тили', flag: '🇷🇺' },
      { code: 'yrk', name: 'ненэця\' вада', flag: '🇷🇺' },
      { code: 'sel', name: 'Селькуп', flag: '🇷🇺' },
      { code: 'kca', name: 'Ханты ясанг', flag: '🇷🇺' },
      { code: 'mns', name: 'Манси лāтыӈ', flag: '🇷🇺' },
      { code: 'eve', name: 'Эвэн бисэд', flag: '🇷🇺' },
      { code: 'evn', name: 'Эвэнкил турэн', flag: '🇷🇺' },
      { code: 'nio', name: 'Нивх диф', flag: '🇷🇺' },
      { code: 'ulc', name: 'Нани хэсэни', flag: '🇷🇺' },
      { code: 'oac', name: 'Орочи хэсэни', flag: '🇷🇺' },
      { code: 'ude', name: 'Удэ кэйэни', flag: '🇷🇺' },
      { code: 'gld', name: 'Нанай хэсэни', flag: '🇷🇺' },
      { code: 'orh', name: 'Орок асикни', flag: '🇷🇺' },
      { code: 'ckt', name: 'Чукот вэтгав', flag: '🇷🇺' },
      { code: 'ccy', name: 'Чукч илгъиитэ', flag: '🇷🇺' },
      { code: 'ykg', name: 'Юкагир тиэ', flag: '🇷🇺' },
      { code: 'yux', name: 'Юкагир вадул', flag: '🇷🇺' },
      { code: 'ket', name: 'Кетский язык', flag: '🇷🇺' },
      { code: 'yrk', name: 'Ненэця вада', flag: '🇷🇺' },
      { code: 'enh', name: 'Энец биса', flag: '🇷🇺' },
      { code: 'nru', name: 'Нганасан тенысь', flag: '🇷🇺' },
      { code: 'dlg', name: 'Долган тыла', flag: '🇷🇺' },
      
      // Papouasie-Nouvelle-Guinée
      { code: 'hmo', name: 'Hiri Motu', flag: '🇵🇬' },
      { code: 'tpi', name: 'Tok Pisin', flag: '🇵🇬' },
      { code: 'ho', name: 'Hiri Motu', flag: '🇵🇬' },
      
      // Autres langues rares
      { code: 'vie', name: 'Tiếng Việt', flag: '🇻🇳' },
      { code: 'khm', name: 'ភាសាខ្មែរ', flag: '🇰🇭' },
      { code: 'lao', name: 'ພາສາລາວ', flag: '🇱🇦' },
      { code: 'mya', name: 'မြန်မာစာ', flag: '🇲🇲' },
      { code: 'sin', name: 'සිංහල', flag: '🇱🇰' },
      { code: 'tam', name: 'தமிழ்', flag: '🇮🇳' },
      { code: 'mal', name: 'മലയാളം', flag: '🇮🇳' },
      { code: 'kan', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
      { code: 'tel', name: 'తెలుగు', flag: '🇮🇳' },
      { code: 'ori', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
      { code: 'guj', name: 'ગુજરાતી', flag: '🇮🇳' },
      { code: 'pan', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
      { code: 'asm', name: 'অসমীয়া', flag: '🇮🇳' },
      { code: 'ben', name: 'বাংলা', flag: '🇧🇩' },
      { code: 'hin', name: 'हिन्दी', flag: '🇮🇳' },
      { code: 'mar', name: 'मराठी', flag: '🇮🇳' },
      { code: 'nep', name: 'नेपाली', flag: '🇳🇵' },
      { code: 'urd', name: 'اردو', flag: '🇵🇰' },
      { code: 'per', name: 'فارسی', flag: '🇮🇷' },
      { code: 'pus', name: 'پښتو', flag: '🇦🇫' },
      { code: 'div', name: 'ދިވެހި', flag: '🇲🇻' },
      { code: 'tib', name: 'བོད་སྐད', flag: '🇨🇳' },
      { code: 'mao', name: 'Te Reo Māori', flag: '🇳🇿' },
      { code: 'haw', name: 'ʻŌlelo Hawaiʻi', flag: '🇺🇸' },
      { code: 'iku', name: 'ᐃᓄᒃᑎᑐᑦ', flag: '🇨🇦' },
      { code: 'gle', name: 'Gaeilge', flag: '🇮🇪' },
      { code: 'gla', name: 'Gàidhlig', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
      { code: 'cym', name: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
      { code: 'bre', name: 'Brezhoneg', flag: '🇫🇷' },
      { code: 'cor', name: 'Kernewek', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { code: 'glv', name: 'Gaelg', flag: '🇮🇲' },
      { code: 'sco', name: 'Scots', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
      { code: 'gsw', name: 'Schwyzerdütsch', flag: '🇨🇭' },
      { code: 'ltz', name: 'Lëtzebuergesch', flag: '🇱🇺' },
      { code: 'frr', name: 'Nordfriisk', flag: '🇩🇪' },
      { code: 'fry', name: 'Frysk', flag: '🇳🇱' },
      { code: 'stq', name: 'Seeltersk', flag: '🇩🇪' },
      { code: 'nds', name: 'Plattdüütsch', flag: '🇩🇪' },
      { code: 'yid', name: 'יידיש', flag: '🇮🇱' },
      { code: 'lad', name: 'Ladino', flag: '🇮🇱' },
      { code: 'rom', name: 'Romani ćhib', flag: '🏴‍☠️' },
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
