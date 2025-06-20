
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, User, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavigationProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const Navigation = ({ onOpenAuth }: NavigationProps) => {
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              BimFun
            </h1>
          </Link>
          
          {/* Menu de navigation */}
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
