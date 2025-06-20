
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
}

const AuthModal = ({ mode, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createCheckout } = useSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté à BimFun",
        });
        onClose();
        // Rester sur la page actuelle après connexion
      } else {
        await signUp(email, password);
        toast({
          title: "Inscription réussie",
          description: "Redirection vers l'abonnement...",
        });
        onClose();
        // Déclencher automatiquement le processus d'abonnement après inscription
        setTimeout(() => {
          createCheckout();
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? 'Connectez-vous à votre compte BimFun'
              : 'Créez votre compte BimFun et accédez à l\'abonnement'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Chargement...' : (mode === 'login' ? 'Se connecter' : "S'inscrire")}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;
