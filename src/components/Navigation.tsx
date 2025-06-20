
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, User, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavigationProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const Navigation = ({ onOpenAuth }: NavigationProps) => {
  console.log('Navigation component is rendering');
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();

  console.log('User state in Navigation:', user);
  console.log('UserRole in Navigation:', userRole);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src="/lovable-uploads/3ad16cd3-6fcc-475f-bc25-eaad941f1b74.png" 
              alt="BimFun Logo" 
              className="h-12 sm:h-16 w-auto hover:opacity-80 transition-opacity"
            />
          </Link>
          
          {/* Navigation Links - Masqués sur mobile, visibles sur desktop */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base"
            >
              Fonctionnalités
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base"
            >
              Tarifs
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base"
            >
              À propos
            </button>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base"
            >
              Contact
            </Link>
          </div>
          
          {/* User Menu - Optimisé pour mobile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1 sm:space-x-2 hover:bg-blue-50 px-2 sm:px-3">
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">Dashboard</span>
                  </Button>
                </Link>

                {userRole === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1 sm:space-x-2 hover:bg-blue-50 px-2 sm:px-3">
                      <Shield className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm">Admin</span>
                    </Button>
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 sm:space-x-2 hover:bg-red-50 hover:text-red-600 px-2 sm:px-3"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Déconnexion</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onOpenAuth('login')}
                  className="hover:bg-blue-50 hover:text-blue-600 px-2 sm:px-4 text-sm"
                  size="sm"
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => onOpenAuth('signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-6 py-2 text-sm"
                  size="sm"
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
