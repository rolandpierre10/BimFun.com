
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Star, MessageCircle, Video, Phone, Users, Camera, Image, Mic, Share2, Bell, Settings, Shield, Loader2 } from 'lucide-react';
import PublicFeed from '@/components/PublicFeed';
import SubscriptionButton from '@/components/SubscriptionButton';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import InstallPrompt from '@/components/InstallPrompt';
import DemoInteractions from '@/components/DemoInteractions';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  console.log('Index page is rendering');
  const { user } = useAuth();
  const { createCheckout } = useSubscription();
  const { toast } = useToast();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  // Écouter l'événement personnalisé pour réouvrir le modal de connexion après inscription
  useEffect(() => {
    const handleOpenAuthModal = (event: any) => {
      const { mode } = event.detail;
      setAuthModal({ isOpen: true, mode });
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);
    return () => window.removeEventListener('openAuthModal', handleOpenAuthModal);
  }, []);

  const handleStartNow = async (e: React.MouseEvent) => {
    // Empêcher les événements par défaut et la propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Éviter les doubles clics/touches
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      if (user) {
        console.log('User authenticated, creating checkout session');
        
        // Show preparing message
        toast({
          title: "Préparation du paiement...",
          description: "Redirection vers Stripe en cours",
        });
        
        await createCheckout();
      } else {
        handleOpenAuth('signup');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erreur de paiement",
        description: "Impossible de créer la session de paiement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  console.log('About to render Navigation component');

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoInteractions />
      <Navigation onOpenAuth={handleOpenAuth} />
      
      <div className="pt-16 sm:pt-18 lg:pt-20">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          {/* Header - Optimisé mobile et desktop */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12 px-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
              Bienvenue sur BimFun
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed max-w-4xl mx-auto">
              La plateforme sociale où les professionnels partagent, découvrent et s'inspirent à travers du contenu créatif du monde entier.
            </p>
          </div>

          {/* Section Services - Grid responsive optimisé */}
          <section id="services" className="mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 text-center px-2">Nos Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              
              {/* Publications créatives */}
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-2 sm:pb-3 lg:pb-4">
                  <div className="mx-auto mb-2 sm:mb-3 lg:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Camera className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Publications créatives</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Partagez vos créations avec la communauté et découvrez le travail d'autres créateurs.</p>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
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
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-2 sm:pb-3 lg:pb-4">
                  <div className="mx-auto mb-2 sm:mb-3 lg:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Messagerie avancée</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Communiquez instantanément avec d'autres membres de la plateforme.</p>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
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

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-2 sm:pb-3 lg:pb-4">
                  <div className="mx-auto mb-2 sm:mb-3 lg:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Appels vocaux</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Communiquez par la voix avec des appels audio haute qualité.</p>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
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

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-2 sm:pb-3 lg:pb-4">
                  <div className="mx-auto mb-2 sm:mb-3 lg:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Video className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Appels vidéo</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Collaborez en face à face avec des appels vidéo intégrés.</p>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
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

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-2 sm:pb-3 lg:pb-4">
                  <div className="mx-auto mb-2 sm:mb-3 lg:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Réseau professionnel</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Connectez-vous avec d'autres professionnels et développez votre réseau.</p>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
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

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-2 sm:pb-3 lg:pb-4">
                  <div className="mx-auto mb-2 sm:mb-3 lg:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Interactions sociales</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Engagez-vous avec la communauté à travers diverses interactions.</p>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
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

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-2 sm:pb-3 lg:pb-4">
                  <div className="mx-auto mb-2 sm:mb-3 lg:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Sécurité & Confidentialité</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Vos données sont protégées avec les plus hauts standards de sécurité.</p>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
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

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-2 sm:pb-3 lg:pb-4">
                  <div className="mx-auto mb-2 sm:mb-3 lg:mb-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Mic className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Messages vocaux</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">Envoyez des messages vocaux expressifs et personnalisés.</p>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
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

          {/* Section Tarifs - Responsive optimisé */}
          <section id="pricing" className="mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 text-center px-2">Abonnement</h2>
            <div className="max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md text-center border-2 border-blue-200">
              <div className="mb-3 sm:mb-4 lg:mb-6">
                <Crown className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 mx-auto mb-2" />
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">BimFun Premium</h3>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  10,00 $
                  <span className="text-sm sm:text-base lg:text-lg font-normal text-gray-600">/mois</span>
                </div>
                <p className="text-gray-600 mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm lg:text-base">Accès complet à toutes les fonctionnalités</p>
              </div>
              
              <div className="mb-4 sm:mb-6">
                <ul className="space-y-1 sm:space-y-2 lg:space-y-3 text-left">
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Publications créatives illimitées</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Messagerie avancée en temps réel</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Appels vocaux et vidéo HD</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Réseau professionnel étendu</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Sécurité renforcée</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-base">Support prioritaire</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-md text-sm sm:text-base lg:text-lg py-3 sm:py-4 px-4 transition-all duration-200 touch-manipulation flex items-center justify-center gap-2"
                onClick={handleStartNow}
                disabled={isProcessing}
                style={{ 
                  minHeight: '48px',
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none',
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                {isProcessing ? "Préparation..." : "Commencer maintenant"}
              </Button>
              
              <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 lg:mt-4">
                Annulation possible à tout moment
              </p>
            </div>
          </section>

          {/* Section About - Responsive optimisé */}
          <section id="about" className="mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 text-center px-2">À propos</h2>
            <div className="max-w-2xl lg:max-w-4xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                BimFun est une plateforme sociale innovante conçue pour les créateurs et les professionnels qui souhaitent partager leur travail, collaborer et se connecter avec une communauté dynamique.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                Notre mission est de fournir un espace sûr et créatif où les idées peuvent s'épanouir et où les collaborations peuvent naître naturellement.
              </p>
            </div>
          </section>

          {/* Section Subscription - Layout responsive amélioré */}
          <section id="subscription" className="mb-8 sm:mb-12 lg:mb-16">
            <div className="space-y-4 sm:space-y-6">
              {/* Bouton d'abonnement mobile */}
              {user && (
                <div className="block lg:hidden">
                  <SubscriptionButton />
                </div>
              )}

              {/* Layout principal avec feed */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Sidebar desktop uniquement */}
                <div className="hidden lg:block lg:col-span-1">
                  {user && <SubscriptionButton />}
                </div>

                {/* Zone de contenu principal */}
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
