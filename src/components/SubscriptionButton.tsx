
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Star, Loader2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const SubscriptionButton = () => {
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    loading, 
    createCheckout, 
    openCustomerPortal 
  } = useSubscription();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [redirecting, setRedirecting] = React.useState(false);

  const handleSubscribe = async (e: React.MouseEvent) => {
    // Empêcher les événements par défaut et la propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Éviter les doubles clics/touches
    if (isProcessing || redirecting) return;
    
    setIsProcessing(true);
    
    try {
      console.log('Subscribe button clicked - starting process');
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('User not authenticated');
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour vous abonner",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      console.log('User authenticated, creating checkout session');
      
      // Show preparing message
      toast({
        title: "Préparation du paiement...",
        description: "Redirection vers Stripe en cours",
      });
      
      // Call the edge function directly
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Erreur du serveur: ${error.message}`);
      }
      
      console.log('Checkout response received:', data);
      
      if (!data || !data.url) {
        console.error('No checkout URL received:', data);
        throw new Error('Aucune URL de paiement reçue du serveur');
      }

      console.log('Redirecting to Stripe checkout:', data.url);
      
      // Set redirecting state
      setRedirecting(true);
      
      // Show success message before redirect
      toast({
        title: "Redirection en cours...",
        description: "Ouverture de Stripe",
      });
      
      // Redirection immédiate pour mobile
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Complete error in handleSubscribe:', error);
      setIsProcessing(false);
      setRedirecting(false);
      
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
    }
  };

  if (subscribed) {
    return (
      <Card className="border-green-200 bg-green-50 w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800 text-sm sm:text-base">
            <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
            Abonnement Actif
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700">
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
            Plan: {subscription_tier}
          </div>
          {subscription_end && (
            <div className="text-xs sm:text-sm text-green-600">
              Expire le: {new Date(subscription_end).toLocaleDateString('fr-FR')}
            </div>
          )}
          <Button 
            onClick={openCustomerPortal}
            disabled={loading}
            variant="outline"
            size="sm"
            className="w-full py-3 text-sm touch-manipulation"
            style={{ minHeight: '48px' }}
          >
            Gérer l'abonnement
          </Button>
        </CardContent>
      </Card>
    );
  }

  const buttonDisabled = loading || isProcessing || redirecting;
  const getButtonText = () => {
    if (redirecting) return "Redirection...";
    if (isProcessing) return "Préparation...";
    if (loading) return "Chargement...";
    return "S'abonner maintenant";
  };

  return (
    <Card className="border-blue-200 bg-blue-50 w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 text-sm sm:text-base">
          <Star className="h-4 w-4 sm:h-5 sm:w-5" />
          BimFun Premium
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-1 text-xs sm:text-sm text-blue-700">
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
            Accès illimité aux publications
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
            Messagerie avancée
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
            Fonctionnalités premium
          </li>
        </ul>
        
        {/* Bouton optimisé pour mobile */}
        <Button 
          onClick={handleSubscribe}
          disabled={buttonDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-all duration-200 touch-manipulation text-sm sm:text-base flex items-center justify-center gap-2 py-4 px-4"
          style={{ 
            minHeight: '56px',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            cursor: buttonDisabled ? 'not-allowed' : 'pointer'
          }}
        >
          {(isProcessing || redirecting) && <Loader2 className="h-4 w-4 animate-spin" />}
          {getButtonText()}
        </Button>
        
        {redirecting && (
          <div className="text-center text-xs sm:text-sm text-blue-600 animate-pulse">
            Ne fermez pas cette page...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionButton;
