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

  const handleSubscribe = async () => {
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
        return;
      }

      console.log('User authenticated, invoking create-checkout function');
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        console.error('Checkout function error:', error);
        throw error;
      }
      
      console.log('Checkout function response:', data);
      
      if (!data?.url) {
        console.error('No checkout URL received');
        throw new Error('Aucune URL de checkout reçue');
      }

      console.log('Redirecting to Stripe checkout:', data.url);
      
      // Immediate redirect - no fallbacks to keep it simple and fast
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Complete error in handleSubscribe:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur de paiement",
        description: `Impossible de créer la session de paiement: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (subscribed) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Crown className="h-5 w-5" />
            Abonnement Actif
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <Check className="h-4 w-4" />
            Plan: {subscription_tier}
          </div>
          {subscription_end && (
            <div className="text-sm text-green-600">
              Expire le: {new Date(subscription_end).toLocaleDateString('fr-FR')}
            </div>
          )}
          <Button 
            onClick={openCustomerPortal}
            disabled={loading}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Gérer l'abonnement
          </Button>
        </CardContent>
      </Card>
    );
  }

  const buttonDisabled = loading || isProcessing;
  const buttonText = isProcessing ? "Redirection vers Stripe..." : loading ? "Chargement..." : "S'abonner maintenant";

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Star className="h-5 w-5" />
          BimFun Premium
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-1 text-sm text-blue-700">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Accès illimité aux publications
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Messagerie avancée
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Fonctionnalités premium
          </li>
        </ul>
        <Button 
          onClick={handleSubscribe}
          disabled={buttonDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 touch-manipulation text-base flex items-center justify-center gap-2"
          style={{ minHeight: '48px' }}
        >
          {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionButton;
