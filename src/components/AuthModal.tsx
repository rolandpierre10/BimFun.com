
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        toast({
          title: "Connexion réussie",
          description: "Redirection vers les paiements...",
        });
        onClose();
        // Redirection vers la section abonnement après connexion
        setTimeout(() => {
          const element = document.getElementById('pricing');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      } else {
        await signUp(email, password);
        toast({
          title: "Inscription réussie",
          description: "Redirection vers la connexion...",
        });
        onClose();
        // Redirection automatique vers la connexion après inscription
        setTimeout(() => {
          // Réouvrir le modal en mode connexion
          const event = new CustomEvent('openAuthModal', { detail: { mode: 'login' } });
          window.dispatchEvent(event);
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
              ? 'Connectez-vous pour accéder aux paiements'
              : 'Créez votre compte pour continuer'
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
            {mode === 'signup' && (
              <p className="text-sm text-gray-500 text-center">
                Après inscription, vous serez automatiquement redirigé vers la connexion.
              </p>
            )}
            {mode === 'login' && (
              <p className="text-sm text-gray-500 text-center">
                Après connexion, vous serez redirigé vers les options de paiement.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;
