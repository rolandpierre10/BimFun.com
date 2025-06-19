
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Star } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';

const SubscriptionButton = () => {
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    loading, 
    createCheckout, 
    openCustomerPortal 
  } = useSubscription();

  const handleSubscribe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      // Ouvrir Stripe checkout dans un nouvel onglet pour une meilleure performance
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
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
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Chargement..." : "S'abonner maintenant"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionButton;
