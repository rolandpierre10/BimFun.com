
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PublicFeed from '@/components/PublicFeed';
import SubscriptionButton from '@/components/SubscriptionButton';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';

const Index = () => {
  const { user } = useAuth();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onOpenAuth={handleOpenAuth} />
      
      <div className="pt-16"> {/* Add padding top to account for fixed nav */}
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bienvenue sur BimFun
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              La plateforme sociale pour partager et découvrir du contenu créatif
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar avec abonnement */}
            <div className="lg:col-span-1 space-y-4">
              {user && <SubscriptionButton />}
            </div>

            {/* Zone principale avec le feed public */}
            <div className="lg:col-span-3">
              <PublicFeed />
            </div>
          </div>
        </div>
      </div>

      {authModal.isOpen && (
        <AuthModal mode={authModal.mode} onClose={handleCloseAuth} />
      )}
    </div>
  );
};

export default Index;
