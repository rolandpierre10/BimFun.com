
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Globe, Search } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const { getSupportedLanguages } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  const languages = getSupportedLanguages();
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const filteredLanguages = languages.filter(language =>
    language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    language.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setSearchTerm('');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200 shadow-sm">
          <Globe className="h-5 w-5 text-blue-600" />
          <span className="hidden sm:inline text-gray-700">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden text-xl">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 max-h-[500px] overflow-hidden bg-white border border-gray-200 shadow-xl z-50"
      >
        <div className="p-3 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher parmi toutes les langues du monde..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            {filteredLanguages.length} langue{filteredLanguages.length > 1 ? 's' : ''} trouvée{filteredLanguages.length > 1 ? 's' : ''}
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filteredLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`flex items-center gap-3 cursor-pointer px-4 py-3 hover:bg-blue-50 transition-colors ${
                i18n.language === language.code ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm">{language.name}</span>
              {i18n.language === language.code && (
                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </DropdownMenuItem>
          ))}
          {filteredLanguages.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              <Globe className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <div>Aucune langue trouvée</div>
              <div className="text-xs mt-1">Essayez un autre terme de recherche</div>
            </div>
          )}
        </div>
        <div className="p-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-center">
          🌍 Plus de 400 langues disponibles dans le monde entier
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
