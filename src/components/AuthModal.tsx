
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, CreditCard, Globe, Shield, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, mode }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    profession: '',
    country: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }
    setShowPayment(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Connexion",
      description: "Fonctionnalité en cours de développement",
    });
  };

  const handlePayment = () => {
    toast({
      title: "Paiement en cours",
      description: "Redirection vers la page de paiement sécurisée...",
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'signup');
  };

  if (showPayment) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-w-[95vw] mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
              Finaliser votre abonnement
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base">
              Dernière étape pour rejoindre BimFun
            </DialogDescription>
          </DialogHeader>

          <Card className="border-0 shadow-none">
            <CardHeader className="text-center px-4 py-4">
              <div className="mx-auto mb-3 p-2 bg-yellow-100 rounded-full w-fit">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Abonnement Premium</CardTitle>
              <CardDescription className="text-sm">Accès complet à BimFun</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-4">
              <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">10$ USD</div>
                <div className="text-gray-600 text-sm sm:text-base">par mois</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">Renouvellement automatique</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                  <span>Réseau professionnel global</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                  <span>Publications illimitées</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                  <span>Messages et appels</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                  <span>Support multilingue</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Carte bancaire, PayPal acceptés</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Résiliation possible à tout moment</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 px-4">
              <Button 
                onClick={handlePayment} 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-sm sm:text-lg font-semibold"
              >
                Payer 10$ USD / mois
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowPayment(false)}
                className="w-full text-gray-600 text-sm"
              >
                Retour
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
            Rejoignez BimFun
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">
            Le réseau social professionnel multilingue
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger value="signup" className="text-sm">S'inscrire</TabsTrigger>
            <TabsTrigger value="login" className="text-sm">Se connecter</TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="space-y-4 mt-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-gray-900 h-10 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-gray-900 h-10 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-gray-900 h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession" className="text-sm">Profession</Label>
                <Input
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Développeur, Designer..."
                  className="border-gray-300 focus:border-gray-900 h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm">Pays</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre pays"
                  className="border-gray-300 focus:border-gray-900 h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-gray-900 h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-gray-900 h-10 text-sm"
                />
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-xs sm:text-sm text-yellow-800">
                  <strong>Abonnement requis :</strong> 10$ USD/mois pour accéder à BimFun
                </div>
              </div>

              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11 text-sm font-semibold">
                Continuer vers le paiement
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="login" className="space-y-4 mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginEmail" className="text-sm">Email</Label>
                <Input
                  id="loginEmail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-gray-900 h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginPassword" className="text-sm">Mot de passe</Label>
                <Input
                  id="loginPassword"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-gray-900 h-10 text-sm"
                />
              </div>

              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11 text-sm font-semibold">
                Se connecter
              </Button>

              <div className="text-center">
                <Button variant="link" className="text-gray-600 text-xs sm:text-sm">
                  Mot de passe oublié ?
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
