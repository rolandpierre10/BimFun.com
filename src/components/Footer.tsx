
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  const navigateToPage = (path: string) => {
    window.location.href = path;
  };

  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <p className="text-gray-300">BimFun</p>
            <p className="text-gray-300">Montréal, QC, Canada</p>
            <a 
              href="mailto:support@bimfun.com" 
              className="text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              support@bimfun.com
            </a>
          </div>

          {/* Liens légaux */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.legalInfo')}</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigateToPage('/mentions-legales')}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                {t('footer.legalNotice')}
              </button>
              <button 
                onClick={() => navigateToPage('/politique-cookies')}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                {t('footer.cookiePolicy')}
              </button>
              <button 
                onClick={() => navigateToPage('/contact')}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                {t('footer.contactUs')}
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div>
            <h3 className="text-lg font-semibold mb-4">BimFun</h3>
            <p className="text-gray-300">
              {t('footer.description')}
            </p>
            <p className="text-gray-400 text-sm mt-4">
              © 2024 BimFun - {t('footer.allRightsReserved')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
