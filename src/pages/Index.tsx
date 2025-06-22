import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import ClickableImage from '@/components/ClickableImage';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { handleMobileRedirect } from '@/utils/mobileRedirect';

const Index = () => {
  const { t } = useTranslation();
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
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessing) return;
    
    setIsProcessing(true);
    console.log('Start Now button clicked');
    
    try {
      if (user) {
        console.log('User authenticated, creating checkout session');
        
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          console.log('User not authenticated anymore');
          toast({
            title: "Connexion requise",
            description: "Veuillez vous connecter pour vous abonner",
            variant: "destructive",
          });
          handleOpenAuth('login');
          setIsProcessing(false);
          return;
        }

        toast({
          title: "Redirection vers le paiement...",
          description: "Veuillez patienter",
        });
        
        const { data, error } = await supabase.functions.invoke('create-checkout');
        
        if (error) {
          console.error('Checkout error:', error);
          throw new Error(error.message || 'Erreur lors de la création de la session de paiement');
        }
        
        if (!data?.url) {
          throw new Error('URL de paiement non reçue');
        }
        
        console.log('Checkout session created, redirecting to:', data.url);
        
        // Utiliser la nouvelle fonction de redirection mobile
        handleMobileRedirect(data.url, 'Redirection vers le paiement en cours...');
        
      } else {
        console.log('User not authenticated, opening signup modal');
        handleOpenAuth('signup');
      }
    } catch (error) {
      console.error('Complete error in handleStartNow:', error);
      
      let errorMessage = 'Erreur inconnue';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Erreur de paiement",
        description: `Impossible de créer la session de paiement: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  console.log('About to render Navigation component');

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <DemoInteractions />
      <Navigation onOpenAuth={handleOpenAuth} />
      
      <div className="pt-16 sm:pt-20 lg:pt-24">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              {t('home.title')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto px-2">
              {t('home.subtitle')}
            </p>
          </div>

          {/* Galerie d'images d'appels vidéo */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-2">{t('home.videoCallsTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <ClickableImage
                src="/lovable-uploads/42e4cfc8-b297-45ae-bdc5-61eb1a2b5be0.png"
                alt="Appels vidéo multi-participants sur ordinateur et mobile"
                className="rounded-lg shadow-lg w-full h-40 sm:h-48 object-cover"
                title="Appels vidéo multi-participants"
                description="Connectez-vous avec plusieurs personnes simultanément"
              />
              
              <ClickableImage
                src="/lovable-uploads/3d1a7653-54c7-4fde-904a-a4c2860d53e8.png"
                alt="Réseau professionnel connecté"
                className="rounded-lg shadow-lg w-full h-40 sm:h-48 object-cover"
                title="Réseau professionnel"
                description="Développez votre réseau de contacts professionnels"
              />
              
              <ClickableImage
                src="/lovable-uploads/204a0def-1515-4520-8e02-32f5df1f3b53.png"
                alt="Appels vidéo sur tablette et mobile"
                className="rounded-lg shadow-lg w-full h-40 sm:h-48 object-cover"
                title="Multi-appareils"
                description="Utilisez BimFun sur tous vos appareils"
              />
              
              <div className="sm:col-span-2 lg:col-span-3">
                <ClickableImage
                  src="/lovable-uploads/cc9c6bca-8998-48f7-a0a1-bdfccfac3973.png"
                  alt="Appel vidéo mobile interface utilisateur"
                  className="rounded-lg shadow-lg w-full h-40 sm:h-48 md:h-64 object-cover"
                  title="Interface intuitive"
                  description="Une interface simple et élégante pour vos appels"
                />
              </div>
            </div>
          </section>

          {/* Section Services - Affichage complet sur toutes les tailles d'écran */}
          <section id="services" className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-2">{t('home.servicesTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Publications créatives */}
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Camera className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{t('services.creativePublications.title')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 sm:px-6">
                  <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">{t('services.creativePublications.description')}</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.creativePublications.features.highQuality')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.creativePublications.features.tagsCategories')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.creativePublications.features.viewStats')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Messagerie */}
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{t('services.messaging.title')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 sm:px-6">
                  <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">{t('services.messaging.description')}</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.messaging.features.realTime')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.messaging.features.voice')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.messaging.features.imageShare')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div className="mx-auto mb-4 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{t('services.voiceCalls.title')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 sm:px-6">
                  <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">{t('services.voiceCalls.description')}</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.voiceCalls.features.hdAudio')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.voiceCalls.features.noiseReduction')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.voiceCalls.features.instantConnection')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{t('services.videoCalls.title')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 sm:px-6">
                  <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">{t('services.videoCalls.description')}</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.videoCalls.features.hdQuality')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.videoCalls.features.screenShare')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.videoCalls.features.recording')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{t('services.professionalNetwork.title')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 sm:px-6">
                  <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">{t('services.professionalNetwork.description')}</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.professionalNetwork.features.professionalProfiles')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.professionalNetwork.features.followingSystem')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.professionalNetwork.features.recommendations')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{t('services.socialInteractions.title')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 sm:px-6">
                  <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">{t('services.socialInteractions.description')}</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.socialInteractions.features.likesAndComments')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.socialInteractions.features.contentShare')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.socialInteractions.features.realTimeNotifications')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div className="mx-auto mb-4 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{t('services.security.title')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 sm:px-6">
                  <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">{t('services.security.description')}</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.security.features.endToEndEncryption')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.security.features.confidentialityControl')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.security.features.secureAuthentication')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div className="mx-auto mb-4 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Mic className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{t('services.voiceMessages.title')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 sm:px-6">
                  <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">{t('services.voiceMessages.description')}</p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.voiceMessages.features.easyRecording')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.voiceMessages.features.optimalAudioQuality')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{t('services.voiceMessages.features.instantReading')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

            </div>
          </section>

          {/* Section Tarifs */}
          <section id="pricing" className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-2">{t('home.pricingTitle')}</h2>
            <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md text-center border-2 border-blue-200">
              <div className="mb-6">
                <Crown className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{t('pricing.premium')}</h3>
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                  {t('pricing.price')}
                  <span className="text-base sm:text-lg font-normal text-gray-600">{t('pricing.perMonth')}</span>
                </div>
                <p className="text-gray-600 mb-6 text-sm sm:text-base px-2">{t('pricing.description')}</p>
              </div>
              
              <div className="mb-6">
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{t('pricing.features.unlimitedPublications')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{t('pricing.features.advancedMessaging')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{t('pricing.features.hdCalls')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{t('pricing.features.extendedNetwork')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{t('pricing.features.enhancedSecurity')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{t('pricing.features.prioritySupport')}</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-base sm:text-lg py-4 px-4 transition-colors duration-200"
                onClick={handleStartNow}
                disabled={isProcessing}
                style={{ 
                  minHeight: '56px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessing && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                {isProcessing ? t('home.preparing') : t('home.startNow')}
              </Button>
              
              <p className="text-xs sm:text-sm text-gray-500 mt-4 px-2">
                {t('home.cancelAnytime')}
              </p>
            </div>
          </section>

          {/* Section About */}
          <section id="about" className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-2">{t('home.aboutTitle')}</h2>
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
              <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed px-2">
                {t('about.description1')}
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed px-2">
                {t('about.description2')}
              </p>
            </div>
          </section>

          {/* Section Subscription - Affichage complet sur toutes les tailles */}
          <section id="subscription" className="mb-12 sm:mb-16">
            <div className="space-y-6">
              {/* Bouton d'abonnement pour tous les écrans */}
              {user && (
                <div className="w-full">
                  <SubscriptionButton />
                </div>
              )}

              {/* Layout principal avec feed - Affiché sur toutes les tailles */}
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
