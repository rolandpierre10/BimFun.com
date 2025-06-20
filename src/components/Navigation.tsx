
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, User, LogOut, Shield, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  console.log('User state in Navigation:', user);
  console.log('UserRole in Navigation:', userRole);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
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
          
          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {user && (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="p-2">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </Link>
            )}
            
            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Menu</DrawerTitle>
                </DrawerHeader>
                
                <div className="px-4 pb-6 space-y-4">
                  {/* Navigation Links */}
                  <div className="space-y-3">
                    <button
                      onClick={() => scrollToSection('services')}
                      className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Fonctionnalités
                    </button>
                    <button
                      onClick={() => scrollToSection('pricing')}
                      className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Tarifs
                    </button>
                    <button
                      onClick={() => scrollToSection('about')}
                      className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      À propos
                    </button>
                    <Link
                      to="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Contact
                    </Link>
                  </div>

                  {/* User Actions */}
                  <div className="border-t pt-4 mt-4 space-y-3">
                    {user ? (
                      <>
                        {userRole === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <Shield className="h-4 w-4" />
                            <span>Administration</span>
                          </Link>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Déconnexion</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            onOpenAuth('login');
                            setMobileMenuOpen(false);
                          }}
                          className="w-full justify-start hover:bg-blue-50 hover:text-blue-600"
                        >
                          Connexion
                        </Button>
                        <Button
                          onClick={() => {
                            onOpenAuth('signup');
                            setMobileMenuOpen(false);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          S'inscrire
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
