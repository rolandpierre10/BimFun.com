
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
      
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Bienvenue sur BimFun
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              La plateforme sociale où les professionnels partagent, découvrent et s'inspirent à travers du contenu créatif du monde entier.
            </p>
          </div>

          {/* Galerie d'images d'illustration des appels vidéo */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Communication vidéo professionnelle
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <img 
                  src="/lovable-uploads/4921e08b-7a9e-4bc8-bc40-96680f5c64ff.png" 
                  alt="Interface d'appels vidéo BimFun sur mobile"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <p className="text-gray-600 mt-2 text-sm">
                  Appels vidéo mobiles
                </p>
              </div>
              <div className="text-center">
                <img 
                  src="/lovable-uploads/d7ef8434-3779-4c4e-8925-e39c07b754f9.png" 
                  alt="Interface d'appels vidéo en groupe sur tablette"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <p className="text-gray-600 mt-2 text-sm">
                  Appels en groupe
                </p>
              </div>
              <div className="text-center">
                <img 
                  src="/lovable-uploads/3ad16cd3-6fcc-475f-bc25-eaad941f1b74.png" 
                  alt="Interface d'appel professionnel sur smartphone"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <p className="text-gray-600 mt-2 text-sm">
                  Communication professionnelle
                </p>
              </div>
              <div className="text-center">
                <img 
                  src="/lovable-uploads/258ac0d9-5aad-4ece-9365-c2c7d3698a53.png" 
                  alt="Interface d'appel vidéo moderne"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <p className="text-gray-600 mt-2 text-sm">
                  Interface moderne
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-center text-lg">
              Collaborez en temps réel avec des appels vidéo haute qualité sur tous vos appareils
            </p>
          </div>

          {/* Section Services */}
          <section id="services" className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Nos Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Publications créatives */}
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Camera className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Publications créatives</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-4 text-base">Partagez vos créations avec la communauté et découvrez le travail d'autres créateurs.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Photos et vidéos haute qualité</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Tags et catégories</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Statistiques de vues</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Messagerie */}
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Messagerie avancée</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-4 text-base">Communiquez instantanément avec d'autres membres de la plateforme.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Messages texte en temps réel</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Messages vocaux</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Partage d'images</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">Appels vocaux</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-4 text-base">Communiquez par la voix avec des appels audio haute qualité.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Audio HD cristallin</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Réduction de bruit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Connexion instantanée</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Appels vidéo</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-4 text-base">Collaborez en face à face avec des appels vidéo intégrés.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Qualité HD</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Partage d'écran</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Enregistrement</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Réseau professionnel</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-4 text-base">Connectez-vous avec d'autres professionnels et développez votre réseau.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Profils professionnels</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Système de suivi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Recommandations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Interactions sociales</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-4 text-base">Engagez-vous avec la communauté à travers diverses interactions.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Likes et commentaires</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Partage de contenu</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Notifications temps réel</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">Sécurité & Confidentialité</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-4 text-base">Vos données sont protégées avec les plus hauts standards de sécurité.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Chiffrement end-to-end</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Contrôle de confidentialité</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Authentification sécurisée</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Mic className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-lg">Messages vocaux</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-4 text-base">Envoyez des messages vocaux expressifs et personnalisés.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Enregistrement facile</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Qualité audio optimale</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Lecture instantanée</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

            </div>
          </section>

          {/* Section Tarifs */}
          <section id="pricing" className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Abonnement</h2>
            <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md text-center border-2 border-blue-200">
              <div className="mb-6">
                <Crown className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">BimFun Premium</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  10,00 $
                  <span className="text-lg font-normal text-gray-600">/mois</span>
                </div>
                <p className="text-gray-600 mb-6 text-base">Accès complet à toutes les fonctionnalités</p>
              </div>
              
              <div className="mb-6">
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Publications créatives illimitées</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Messagerie avancée en temps réel</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Appels vocaux et vidéo HD</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Réseau professionnel étendu</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Sécurité renforcée</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-base">Support prioritaire</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-md text-lg py-4 px-4 transition-all duration-200 touch-manipulation flex items-center justify-center gap-2"
                onClick={handleStartNow}
                disabled={isProcessing}
                style={{ 
                  minHeight: '56px',
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none',
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessing && <Loader2 className="h-5 w-5 animate-spin" />}
                {isProcessing ? "Préparation..." : "Commencer maintenant"}
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                Annulation possible à tout moment
              </p>
            </div>
          </section>

          {/* Section About */}
          <section id="about" className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">À propos</h2>
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                BimFun est une plateforme sociale innovante conçue pour les créateurs et les professionnels qui souhaitent partager leur travail, collaborer et se connecter avec une communauté dynamique.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Notre mission est de fournir un espace sûr et créatif où les idées peuvent s'épanouir et où les collaborations peuvent naître naturellement.
              </p>
            </div>
          </section>

          {/* Section Subscription */}
          <section id="subscription" className="mb-16">
            <div className="space-y-6">
              {/* Bouton d'abonnement mobile */}
              {user && (
                <div className="block lg:hidden">
                  <SubscriptionButton />
                </div>
              )}

              {/* Layout principal avec feed */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
