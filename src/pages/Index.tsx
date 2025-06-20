
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Star } from 'lucide-react';
import PublicFeed from '@/components/PublicFeed';
import SubscriptionButton from '@/components/SubscriptionButton';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import InstallPrompt from '@/components/InstallPrompt';
import DemoInteractions from '@/components/DemoInteractions';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
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
      <DemoInteractions />
      <Navigation onOpenAuth={handleOpenAuth} />
      
      <div className="pt-16">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bienvenue sur BimFun
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              La plateforme sociale où les professionnels partagent, découvrent et s'inspirent à travers du contenu créatif du monde entier.
            </p>
          </div>

          {/* Section Mobile Premium - Visible uniquement sur mobile */}
          {isMobile && (
            <section className="mb-8 md:hidden">
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
                <CardHeader className="pb-4 text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-blue-800 text-xl">
                    <Star className="h-6 w-6 text-yellow-500" />
                    BimFun Premium
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Accès illimité aux publications</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Messagerie avancée</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Fonctionnalités premium</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => handleOpenAuth('signup')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                    size="lg"
                  >
                    S'abonner maintenant
                  </Button>
                </CardContent>
              </Card>
            </section>
          )}

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

          {/* Section Tarifs - masquée sur mobile car remplacée par la section mobile premium */}
          <section id="pricing" className={`mb-16 ${isMobile ? 'hidden' : ''}`}>
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

      <Footer />

      {authModal.isOpen && (
        <AuthModal mode={authModal.mode} onClose={handleCloseAuth} />
      )}

      <InstallPrompt />
    </div>
  );
};

export default Index;
