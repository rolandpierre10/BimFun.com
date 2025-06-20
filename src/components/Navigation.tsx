
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, User, LogOut, Shield, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const Navigation = ({ onOpenAuth }: NavigationProps) => {
  console.log('Navigation component is rendering');
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  console.log('User state in Navigation:', user);
  console.log('UserRole in Navigation:', userRole);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsDrawerOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsDrawerOpen(false);
  };

  const handleAuthAction = (mode: 'login' | 'signup') => {
    onOpenAuth(mode);
    setIsDrawerOpen(false);
  };

  const MobileMenuContent = () => (
    <div className="p-6 space-y-4">
      {/* Navigation Links */}
      <div className="space-y-3">
        <button
          onClick={() => scrollToSection('services')}
          className="block w-full text-left text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
        >
          Fonctionnalités
        </button>
        <button
          onClick={() => scrollToSection('pricing')}
          className="block w-full text-left text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
        >
          Tarifs
        </button>
        <button
          onClick={() => scrollToSection('about')}
          className="block w-full text-left text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
        >
          À propos
        </button>
        <Link
          to="/contact"
          className="block w-full text-left text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
          onClick={() => setIsDrawerOpen(false)}
        >
          Contact
        </Link>
      </div>

      <div className="border-t pt-4">
        {user ? (
          <div className="space-y-3">
            <Link to="/dashboard" onClick={() => setIsDrawerOpen(false)}>
              <Button variant="ghost" size="lg" className="w-full justify-start">
                <MessageCircle className="h-5 w-5 mr-3" />
                Dashboard
              </Button>
            </Link>

            {userRole === 'admin' && (
              <Link to="/admin" onClick={() => setIsDrawerOpen(false)}>
                <Button variant="ghost" size="lg" className="w-full justify-start">
                  <Shield className="h-5 w-5 mr-3" />
                  Admin
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="lg"
              onClick={handleLogout}
              className="w-full justify-start hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Déconnexion
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => handleAuthAction('login')}
              className="w-full"
            >
              Connexion
            </Button>
            <Button
              size="lg"
              onClick={() => handleAuthAction('signup')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              S'inscrire
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50" style={{ minHeight: '70px' }}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/3ad16cd3-6fcc-475f-bc25-eaad941f1b74.png" 
              alt="BimFun Logo" 
              className="h-16 w-auto hover:opacity-80 transition-opacity"
            />
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
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
          
          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
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
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => onOpenAuth('signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <MobileMenuContent />
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
