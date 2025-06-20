
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

  const handleStartNow = () => {
    if (user) {
      // Si l'utilisateur est connecté, aller directement au checkout
      createCheckout();
    } else {
      // Si l'utilisateur n'est pas connecté, ouvrir la modal d'inscription
      handleOpenAuth('signup');
    }
  };

  console.log('About to render Navigation component');

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoInteractions />
      <Navigation onOpenAuth={handleOpenAuth} />
      
      {/* Ajout d'un padding-top plus important pour s'assurer que le contenu ne soit pas caché derrière la navigation fixe */}
      <div className="pt-20">
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

          {/* Section Services */}
          <section id="services" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nos Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Publications créatives */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Camera className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Publications créatives</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">Partagez vos créations avec la communauté et découvrez le travail d'autres créateurs.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Photos et vidéos haute qualité
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Tags et catégories
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Statistiques de vues
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Messagerie */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Messagerie avancée</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">Communiquez instantanément avec d'autres membres de la plateforme.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Messages texte en temps réel
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Messages vocaux
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Partage d'images
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Appels vocaux */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">Appels vocaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">Communiquez par la voix avec des appels audio haute qualité.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Audio HD cristallin
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Réduction de bruit
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Connexion instantanée
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Appels vidéo */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Appels vidéo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">Collaborez en face à face avec des appels vidéo intégrés.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Qualité HD
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Partage d'écran
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Enregistrement
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Réseau social */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Réseau professionnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">Connectez-vous avec d'autres professionnels et développez votre réseau.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Profils professionnels
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Système de suivi
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Recommandations
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Interactions */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Interactions sociales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">Engagez-vous avec la communauté à travers diverses interactions.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Likes et commentaires
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Partage de contenu
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Notifications temps réel
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Sécurité */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">Sécurité & Confidentialité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">Vos données sont protégées avec les plus hauts standards de sécurité.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Chiffrement end-to-end
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Contrôle de confidentialité
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Authentification sécurisée
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Messages vocaux */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Mic className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-lg">Messages vocaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">Envoyez des messages vocaux expressifs et personnalisés.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Enregistrement facile
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Qualité audio optimale
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Lecture instantanée
                    </li>
                  </ul>
                </CardContent>
              </Card>

            </div>
          </section>

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
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center border-2 border-blue-200">
              <div className="mb-4">
                <Crown className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold mb-2">BimFun Premium</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  10,00 $
                  <span className="text-lg font-normal text-gray-600">/mois</span>
                </div>
                <p className="text-gray-600 mb-6">Accès complet à toutes les fonctionnalités</p>
              </div>
              
              <div className="mb-6">
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Publications créatives illimitées</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Messagerie avancée en temps réel</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Appels vocaux et vidéo HD</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Réseau professionnel étendu</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Sécurité renforcée</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                onClick={handleStartNow}
              >
                Commencer maintenant
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                Annulation possible à tout moment
              </p>
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
