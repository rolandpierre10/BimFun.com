
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from '@/hooks/useSubscription';
import UserPublications from '@/components/UserPublications';
import SubscriptionButton from '@/components/SubscriptionButton';

const Dashboard = () => {
  const { subscribed, subscription_tier, subscription_end, loading } = useSubscription();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Gérez vos publications et votre contenu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar avec statistiques et abonnement */}
          <div className="lg:col-span-1 space-y-4">
            {/* Statut d'abonnement */}
            <SubscriptionButton />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mes statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Publications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">248</div>
                  <div className="text-sm text-gray-600">Likes totaux</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">1.2k</div>
                  <div className="text-sm text-gray-600">Vues totales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">45</div>
                  <div className="text-sm text-gray-600">Commentaires</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone principale avec publications */}
          <div className="lg:col-span-3">
            <UserPublications isOwnProfile={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
