import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, User, LogOut, Shield, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import { handleMobileLogout } from '@/utils/mobileRedirect';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface NavigationProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const Navigation = ({ onOpenAuth }: NavigationProps) => {
  console.log('Navigation component is rendering');
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  console.log('User state in Navigation:', user);
  console.log('UserRole in Navigation:', userRole);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('Logout button clicked - starting logout process');
      setMobileMenuOpen(false);
      await logout();
      console.log('Logout successful, navigating to home');
      
      // Utiliser la nouvelle fonction de redirection mobile pour la déconnexion
      handleMobileLogout();
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          {/* Logo */}
          <div className="flex-shrink-0 w-auto max-w-[40%] sm:max-w-[50%] overflow-hidden">
            <Link to="/" className="block">
              <img 
                src="/lovable-uploads/645f62d9-970f-4252-8a69-4c1f8ffe6dd0.png" 
                alt="BimFun Logo" 
                className="h-10 sm:h-12 md:h-16 lg:h-20 xl:h-24 w-auto max-w-full hover:opacity-80 transition-opacity object-contain"
              />
            </Link>
          </div>
          
          {/* Mobile Menu - Always show all elements */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
            <LanguageSelector />
            
            {user && (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="p-2 min-w-[36px] h-9">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </Link>
            )}
            
            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="p-2 min-w-[36px] h-9 border-gray-300">
                  <Menu className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[80vh]">
                <DrawerHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <DrawerTitle>Menu</DrawerTitle>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="sm" className="p-2">
                        <X className="h-4 w-4" />
                      </Button>
                    </DrawerClose>
                  </div>
                </DrawerHeader>
                
                <div className="px-4 py-6 space-y-2 overflow-y-auto">
                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <button
                      onClick={() => scrollToSection('services')}
                      className="w-full text-left py-4 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                      style={{ minHeight: '56px', WebkitTapHighlightColor: 'transparent' }}
                    >
                      Fonctionnalités
                    </button>
                    <button
                      onClick={() => scrollToSection('pricing')}
                      className="w-full text-left py-4 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                      style={{ minHeight: '56px', WebkitTapHighlightColor: 'transparent' }}
                    >
                      Tarifs
                    </button>
                    <button
                      onClick={() => scrollToSection('about')}
                      className="w-full text-left py-4 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                      style={{ minHeight: '56px', WebkitTapHighlightColor: 'transparent' }}
                    >
                      À propos
                    </button>
                    <Link
                      to="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-left py-4 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                      style={{ minHeight: '56px', WebkitTapHighlightColor: 'transparent' }}
                    >
                      Contact
                    </Link>
                  </div>

                  {/* User Actions */}
                  <div className="border-t pt-4 mt-6 space-y-1">
                    {user ? (
                      <>
                        {userRole === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center space-x-3 py-4 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                            style={{ minHeight: '56px', WebkitTapHighlightColor: 'transparent' }}
                          >
                            <Shield className="h-5 w-5" />
                            <span>Administration</span>
                          </Link>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full text-left py-4 px-4 text-lg font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation active:bg-red-100"
                          style={{ 
                            minHeight: '56px',
                            WebkitTapHighlightColor: 'transparent',
                            cursor: 'pointer'
                          }}
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Déconnexion</span>
                        </button>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            onOpenAuth('login');
                            setMobileMenuOpen(false);
                          }}
                          className="w-full justify-start text-lg py-6 hover:bg-blue-50 hover:text-blue-600 touch-manipulation"
                          style={{ minHeight: '56px', WebkitTapHighlightColor: 'transparent' }}
                        >
                          Connexion
                        </Button>
                        <Button
                          onClick={() => {
                            onOpenAuth('signup');
                            setMobileMenuOpen(false);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 touch-manipulation active:bg-blue-800"
                          style={{ minHeight: '56px', WebkitTapHighlightColor: 'transparent' }}
                        >
                          S'inscrire
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          
          {/* Desktop/Tablet Navigation - Show from medium screens and up */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Fonctionnalités
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Tarifs
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              À propos
            </button>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Contact
            </Link>
          </div>
          
          {/* Desktop/Tablet User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-blue-50">
                    <MessageCircle className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                {userRole === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-blue-50">
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onOpenAuth('login')}
                  className="hover:bg-blue-50 hover:text-blue-600"
                  size="sm"
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => onOpenAuth('signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
