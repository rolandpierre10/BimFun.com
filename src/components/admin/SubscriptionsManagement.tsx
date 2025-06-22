
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Search, RefreshCw, Crown, Calendar, Mail, User } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  user_id: string;
  stripe_customer_id: string;
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    username: string;
  } | null;
}

const SubscriptionsManagement: React.FC = () => {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      console.log('Loading subscribers...');
      const { data, error } = await supabase
        .from('subscribers')
        .select(`
          *,
          profiles:user_id (
            full_name,
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading subscribers:', error);
        throw error;
      }

      console.log('Subscribers loaded:', data?.length || 0);
      
      // Transformer les données pour correspondre au type attendu
      const formattedData = data?.map(item => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      })) || [];
      
      setSubscribers(formattedData);
    } catch (error) {
      console.error('Error loading subscribers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les abonnements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async (subscriberId: string) => {
    setRefreshing(true);
    try {
      // Déclencher une vérification d'abonnement via l'edge function
      const { error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      toast({
        title: "Abonnement actualisé",
        description: "Le statut d'abonnement a été vérifié",
      });
      
      await loadSubscribers();
    } catch (error) {
      console.error('Error refreshing subscription:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser l'abonnement",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubscriptionBadge = (subscribed: boolean, tier: string) => {
    if (!subscribed) {
      return <Badge variant="outline">Gratuit</Badge>;
    }
    return <Badge variant="default">{tier || 'Premium'}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Gestion des Abonnements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des abonnements...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Gestion des Abonnements</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par email, nom ou nom d'utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={loadSubscribers}
              disabled={refreshing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </Button>
          </div>

          {filteredSubscribers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {searchTerm ? 'Aucun abonnement trouvé pour cette recherche' : 'Aucun abonnement trouvé'}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredSubscribers.map((subscriber) => (
                <Card key={subscriber.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm">
                            {subscriber.profiles?.full_name || 'Nom non disponible'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{subscriber.email}</span>
                        </div>
                        {subscriber.profiles?.username && (
                          <p className="text-xs text-gray-500">@{subscriber.profiles.username}</p>
                        )}
                      </div>
                      {getSubscriptionBadge(subscriber.subscribed, subscriber.subscription_tier)}
                    </div>
                    
                    {subscriber.subscribed && subscriber.subscription_end && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>Expire le: {new Date(subscriber.subscription_end).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Inscrit: {new Date(subscriber.created_at).toLocaleDateString('fr-FR')}
                    </div>

                    {subscriber.stripe_customer_id && (
                      <p className="text-xs text-gray-400">
                        ID Stripe: {subscriber.stripe_customer_id}
                      </p>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => refreshSubscription(subscriber.id)}
                      disabled={refreshing}
                      className="w-full"
                    >
                      <RefreshCw className={`h-3 w-3 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      Actualiser
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionsManagement;
