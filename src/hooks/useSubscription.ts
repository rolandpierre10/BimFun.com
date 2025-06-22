
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleMobileRedirect } from '@/utils/mobileRedirect';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

export const useSubscription = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkSubscription = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le statut d'abonnement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async () => {
    try {
      setLoading(true);
      console.log('Creating checkout session via useSubscription hook...');
      
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (!data?.url) {
        throw new Error('URL de paiement non reçue');
      }
      
      console.log('Checkout URL received, redirecting:', data.url);
      
      // Utiliser la fonction handleMobileRedirect pour une redirection cohérente
      handleMobileRedirect(data.url, 'Redirection vers le paiement...');
      
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      setLoading(true);
      console.log('Opening customer portal via useSubscription hook...');
      
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (!data?.url) {
        throw new Error('URL du portail client non reçue');
      }
      
      console.log('Customer portal URL received, redirecting:', data.url);
      
      // Utiliser la fonction handleMobileRedirect pour une redirection cohérente
      handleMobileRedirect(data.url, 'Redirection vers le portail client...');
      
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le portail client",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        checkSubscription();
      } else if (event === 'SIGNED_OUT') {
        setSubscriptionData({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null
        });
      }
    });

    // Vérifier immédiatement si l'utilisateur est connecté
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        checkSubscription();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    ...subscriptionData,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal
  };
};
