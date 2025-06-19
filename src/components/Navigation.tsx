
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Globe } from 'lucide-react';

interface NavigationProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const Navigation = ({ onOpenAuth }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Globe className="h-8 w-8 text-gray-900 mr-2" />
              <span className="text-2xl font-bold text-gray-900">BimFun</span>
              <Badge variant="outline" className="ml-2 text-xs border-gray-400 text-gray-600">
                Professionnel
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Fonctionnalités
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Tarifs
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                À propos
              </button>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => onOpenAuth('login')}
              >
                Se connecter
              </Button>
              <Button 
                className="bg-gray-900 hover:bg-gray-800 text-white"
                onClick={() => onOpenAuth('signup')}
              >
                S'abonner
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium w-full text-left">
              Fonctionnalités
            </button>
            <button className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium w-full text-left">
              Tarifs
            </button>
            <button className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium w-full text-left">
              À propos
            </button>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex flex-col space-y-3 px-3">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700"
                  onClick={() => {
                    onOpenAuth('login');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Se connecter
                </Button>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={() => {
                    onOpenAuth('signup');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  S'abonner - 10$/mois
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
