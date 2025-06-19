import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
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
      
      <div className="pt-16">
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

          {/* Section Fonctionnalités */}
          <section id="features" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Fonctionnalités</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Publications créatives</h3>
                <p className="text-gray-600">Partagez vos créations avec la communauté et découvrez le travail d'autres créateurs.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Messagerie en temps réel</h3>
                <p className="text-gray-600">Communiquez instantanément avec d'autres membres de la plateforme.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Appels vidéo</h3>
                <p className="text-gray-600">Collaborez en face à face avec des appels vidéo intégrés.</p>
              </div>
            </div>
          </section>

          {/* Section Tarifs */}
          <section id="pricing" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Abonnement</h2>
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold mb-4">BimFun Premium</h3>
              <p className="text-gray-600 mb-6">Accès complet à toutes les fonctionnalités</p>
              <Button 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                onClick={() => handleOpenAuth('signup')}
              >
                Commencer maintenant
              </Button>
            </div>
          </section>

          {/* Section À propos */}
          <section id="about" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">À propos</h2>
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <p className="text-lg text-gray-700 mb-4">
                BimFun est une plateforme sociale innovante conçue pour les créateurs et les professionnels qui souhaitent partager leur travail, collaborer et se connecter avec une communauté dynamique.
              </p>
              <p className="text-lg text-gray-700">
                Notre mission est de fournir un espace sûr et créatif où les idées peuvent s'épanouir et où les collaborations peuvent naître naturellement.
              </p>
            </div>
          </section>

          {/* Section Abonnement - visible après inscription */}
          <section id="subscription" className="mb-16">
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
          </section>
        </div>
      </div>

      {authModal.isOpen && (
        <AuthModal mode={authModal.mode} onClose={handleCloseAuth} />
      )}
    </div>
  );
};

export default Index;
