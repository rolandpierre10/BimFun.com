
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
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
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
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
