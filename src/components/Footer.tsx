
import React from 'react';

const Footer = () => {
  const navigateToPage = (path: string) => {
    window.location.href = path;
  };

  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">BimFun</p>
            <p className="text-gray-300">Montréal, QC, Canada</p>
            <a 
              href="mailto:support@bimfun.com" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              support@bimfun.com
            </a>
          </div>

          {/* Liens légaux */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations légales</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigateToPage('/mentions-legales')}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Mentions légales
              </button>
              <button 
                onClick={() => navigateToPage('/politique-cookies')}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Politique de cookies
              </button>
              <button 
                onClick={() => navigateToPage('/contact')}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Nous contacter
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div>
            <h3 className="text-lg font-semibold mb-4">BimFun</h3>
            <p className="text-gray-300">
              Plateforme sociale professionnelle pour créateurs et collaborateurs.
            </p>
            <p className="text-gray-400 text-sm mt-4">
              © 2024 BimFun - Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
