import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Users, MessageCircle, Video, Music, Camera, Heart, Share2, CheckCircle, Star } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Réseau Professionnel Global",
      description: "Connectez-vous avec des professionnels du monde entier"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Multilingue",
      description: "Toutes les langues du monde intégrées"
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Contenu Multimédia",
      description: "Photos, vidéos, musique, mini-séries"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Chat & Appels",
      description: "Messages texte, vocal, audio/vidéo"
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Streaming Live",
      description: "Diffusez en direct vos contenus"
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: "Contenu Audio",
      description: "Podcasts, musique, contenus audio"
    }
  ];

  const pricingFeatures = [
    "Profil professionnel complet",
    "Publications illimitées",
    "Messages et appels",
    "Contenu multimédia",
    "Réseau global",
    "Support multilingue",
    "Notifications avancées",
    "Gestion d'abonnés"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900">
      <Navigation onOpenAuth={openAuth} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="outline" className="mb-4 text-lg px-6 py-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-300">
              Réseau Social Professionnel
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            BimFun
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Le réseau social professionnel multilingue qui connecte le monde entier. 
            Partagez, échangez et grandissez professionnellement. Publiez vos annonces.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => openAuth('signup')}
            >
              Commencer - 10$/mois
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg transition-all duration-300"
              onClick={() => openAuth('login')}
            >
              Se connecter
            </Button>
          </div>

          <div className="flex justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <span>Mondial</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Professionnel</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Sécurisé</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fonctionnalités Premium
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez toutes les fonctionnalités qui font de BimFun la plateforme de référence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:border-gray-800 transition-all duration-300 hover:shadow-xl group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-full w-fit group-hover:bg-gray-800 group-hover:text-white transition-all duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 text-lg">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Un Seul Plan, Tout Inclus
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Accès complet à toutes les fonctionnalités premium de BimFun
            </p>
          </div>

          <Card className="max-w-md mx-auto bg-white border-4 border-yellow-400 shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-t-lg">
              <div className="flex justify-center mb-2">
                <Star className="h-8 w-8 fill-current" />
              </div>
              <CardTitle className="text-3xl font-bold">Premium</CardTitle>
              <CardDescription className="text-gray-700 text-lg font-semibold">
                Abonnement obligatoire
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 text-gray-900">
              <div className="text-center mb-8">
                <div className="text-5xl font-bold mb-2">10$</div>
                <div className="text-gray-600 text-lg">par mois</div>
                <div className="text-sm text-gray-500 mt-2">Renouvellement automatique</div>
              </div>

              <div className="space-y-4 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-left">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => openAuth('signup')}
              >
                S'abonner Maintenant
              </Button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Paiement sécurisé • Résiliation possible à tout moment
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              À Propos de BimFun
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              BimFun révolutionne le networking professionnel en connectant les talents du monde entier, 
              sans barrières linguistiques ni géographiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Créer une plateforme où chaque professionnel, peu importe sa langue ou sa localisation, 
                peut partager son expertise, développer son réseau et faire progresser sa carrière.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">195+</div>
                  <div className="text-gray-600">Pays supportés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">7000+</div>
                  <div className="text-gray-600">Langues intégrées</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pourquoi BimFun ?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Plateforme Mondiale</h4>
                    <p className="text-gray-600">Accès à un réseau professionnel international</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Sans Barrières</h4>
                    <p className="text-gray-600">Communication fluide dans toutes les langues</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Contenu Riche</h4>
                    <p className="text-gray-600">Partagez tous types de contenus professionnels</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Rejoignez BimFun Aujourd'hui
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connectez-vous avec des millions de professionnels dans le monde entier. 
            Votre réseau professionnel commence ici.
          </p>
          <Button 
            size="lg" 
            className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105"
            onClick={() => openAuth('signup')}
          >
            Commencer Mon Abonnement
          </Button>
        </div>
      </section>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </div>
  );
};

export default Index;
