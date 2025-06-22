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

  const handleSubscribe = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessing) {
      console.log('Already processing, ignoring click');
      return;
    }
    
    console.log('=== SUBSCRIPTION BUTTON CLICKED ===');
    setIsProcessing(true);
    
    try {
      console.log('Step 1: Checking user authentication...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('ERROR: User not authenticated');
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour vous abonner",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      console.log('Step 2: User authenticated, creating checkout session...');
      console.log('User:', { id: user.id, email: user.email });
      
      toast({
        title: "Redirection vers le paiement...",
        description: "Veuillez patienter",
      });
      
      console.log('Step 3: Calling create-checkout function...');
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        console.error('Step 3 ERROR: Checkout error:', error);
        throw new Error(error.message || 'Erreur lors de la création de la session de paiement');
      }
      
      if (!data?.url) {
        console.error('Step 3 ERROR: No URL received in response:', data);
        throw new Error('URL de paiement non reçue');
      }
      
      console.log('Step 4: Checkout session created successfully');
      console.log('Redirect URL:', data.url);
      
      // Redirection directe et simple
      console.log('Step 5: Redirecting directly to Stripe...');
      window.location.href = data.url;
      
    } catch (error) {
      console.error('=== SUBSCRIPTION ERROR ===');
      console.error('Complete error in handleSubscribe:', error);
      setIsProcessing(false);
      
      let errorMessage = 'Erreur inconnue';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      console.error('Final error message:', errorMessage);
      
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
            className="w-full py-3 text-sm"
            style={{ minHeight: '48px' }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement...
              </>
            ) : (
              'Gérer l\'abonnement'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const buttonDisabled = loading || isProcessing;
  const getButtonText = () => {
    if (isProcessing) return "Redirection...";
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
        
        <Button 
          onClick={handleSubscribe}
          disabled={buttonDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 text-sm sm:text-base flex items-center justify-center gap-2 py-4 px-4"
          style={{ 
            minHeight: '56px',
            cursor: buttonDisabled ? 'not-allowed' : 'pointer'
          }}
        >
          {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionButton;
