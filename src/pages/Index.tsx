import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Star, MessageCircle, Video, Phone, Users, Camera, Image, Mic, Share2, Bell, Settings, Shield } from 'lucide-react';
import PublicFeed from '@/components/PublicFeed';
import SubscriptionButton from '@/components/SubscriptionButton';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import InstallPrompt from '@/components/InstallPrompt';
import DemoInteractions from '@/components/DemoInteractions';
import { useSubscription } from '@/hooks/useSubscription';

const Index = () => {
  console.log('Index page is rendering');
  const { user } = useAuth();
  const { createCheckout } = useSubscription();
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

  const handleStartNow = async (e: React.MouseEvent | React.TouchEvent) => {
    // Empêcher les événements par défaut et la propagation pour mobile
    e.preventDefault();
    e.stopPropagation();
    
    if (user) {
      try {
        await createCheckout();
      } catch (error) {
        console.error('Error creating checkout:', error);
      }
    } else {
      handleOpenAuth('signup');
    }
  };

  console.log('About to render Navigation component');

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoInteractions />
      <Navigation onOpenAuth={handleOpenAuth} />
      
      <div className="pt-16 sm:pt-18 lg:pt-20">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          {/* Header - Optimisé mobile */}
          <div className="text-center mb-8 sm:mb-12 px-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Bienvenue sur BimFun
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              La plateforme sociale où les professionnels partagent, découvrent et s'inspirent à travers du contenu créatif du monde entier.
            </p>
          </div>

          {/* Section Services - Grid mobile optimisé */}
          <section id="services" className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-2">Nos Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Publications créatives */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Publications créatives</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-3 sm:mb-4 text-sm sm:text-base">Partagez vos créations avec la communauté et découvrez le travail d'autres créateurs.</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Photos et vidéos haute qualité</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Tags et catégories</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Statistiques de vues</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Messagerie */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Messagerie avancée</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-3 sm:mb-4 text-sm sm:text-base">Communiquez instantanément avec d'autres membres de la plateforme.</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Messages texte en temps réel</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Messages vocaux</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Partage d'images</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Appels vocaux */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Appels vocaux</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-3 sm:mb-4 text-sm sm:text-base">Communiquez par la voix avec des appels audio haute qualité.</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Audio HD cristallin</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Réduction de bruit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Connexion instantanée</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Appels vidéo */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Video className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Appels vidéo</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-3 sm:mb-4 text-sm sm:text-base">Collaborez en face à face avec des appels vidéo intégrés.</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Qualité HD</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Partage d'écran</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Enregistrement</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Réseau social */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Réseau professionnel</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-3 sm:mb-4 text-sm sm:text-base">Connectez-vous avec d'autres professionnels et développez votre réseau.</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Profils professionnels</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Système de suivi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Recommandations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Interactions */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Interactions sociales</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-3 sm:mb-4 text-sm sm:text-base">Engagez-vous avec la communauté à travers diverses interactions.</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Likes et commentaires</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Partage de contenu</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Notifications temps réel</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Sécurité */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Sécurité & Confidentialité</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-3 sm:mb-4 text-sm sm:text-base">Vos données sont protégées avec les plus hauts standards de sécurité.</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Chiffrement end-to-end</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Contrôle de confidentialité</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Authentification sécurisée</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Messages vocaux */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Messages vocaux</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-3 sm:mb-4 text-sm sm:text-base">Envoyez des messages vocaux expressifs et personnalisés.</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Enregistrement facile</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Qualité audio optimale</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>Lecture instantanée</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

            </div>
          </section>

          {/* Section Tarifs - Mobile optimisé avec bouton corrigé */}
          <section id="pricing" className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-2">Abonnement</h2>
            <div className="max-w-sm sm:max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md text-center border-2 border-blue-200">
              <div className="mb-4 sm:mb-6">
                <Crown className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-2" />
                <h3 className="text-xl sm:text-2xl font-bold mb-2">BimFun Premium</h3>
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                  10,00 $
                  <span className="text-base sm:text-lg font-normal text-gray-600">/mois</span>
                </div>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Accès complet à toutes les fonctionnalités</p>
              </div>
              
              <div className="mb-6">
                <ul className="space-y-2 sm:space-y-3 text-left">
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Publications créatives illimitées</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Messagerie avancée en temps réel</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Appels vocaux et vidéo HD</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Réseau professionnel étendu</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Sécurité renforcée</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Support prioritaire</span>
                  </li>
                </ul>
              </div>
              
              {/* Bouton optimisé pour mobile */}
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-md touch-manipulation text-base sm:text-lg py-4 px-4 transition-all duration-200"
                onClick={handleStartNow}
                onTouchStart={handleStartNow}
                style={{ 
                  minHeight: '56px',
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none'
                }}
              >
                Commencer maintenant
              </Button>
              
              <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                Annulation possible à tout moment
              </p>
            </div>
          </section>

          {/* Section À propos - Mobile friendly */}
          <section id="about" className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-2">À propos</h2>
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
              <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
                BimFun est une plateforme sociale innovante conçue pour les créateurs et les professionnels qui souhaitent partager leur travail, collaborer et se connecter avec une communauté dynamique.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Notre mission est de fournir un espace sûr et créatif où les idées peuvent s'épanouir et où les collaborations peuvent naître naturellement.
              </p>
            </div>
          </section>

          {/* Section Feed - Layout mobile optimisé */}
          <section id="subscription" className="mb-12 sm:mb-16">
            <div className="space-y-6">
              {/* Sidebar avec abonnement - En haut sur mobile */}
              {user && (
                <div className="lg:hidden">
                  <SubscriptionButton />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar desktop */}
                <div className="hidden lg:block lg:col-span-1">
                  {user && <SubscriptionButton />}
                </div>

                {/* Zone principale avec le feed public */}
                <div className="lg:col-span-3">
                  <PublicFeed />
                </div>
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
