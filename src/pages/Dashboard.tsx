
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from '@/hooks/useSubscription';
import UserPublications from '@/components/UserPublications';
import SubscriptionButton from '@/components/SubscriptionButton';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';

const Dashboard = () => {
  const { subscribed, subscription_tier, subscription_end, loading } = useSubscription();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onOpenAuth={handleOpenAuth} />
      
      <div className="pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
            <p className="text-gray-600 text-sm sm:text-base">Gérez vos publications et votre contenu</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Sidebar avec statistiques et abonnement - Toujours visible */}
            <div className="lg:col-span-1 order-1 lg:order-1">
              <div className="space-y-4">
                {/* Statut d'abonnement */}
                <div className="w-full">
                  <SubscriptionButton />
                </div>
                
                <Card className="w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">Mes statistiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                      <div className="text-center p-2 sm:p-3">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">12</div>
                        <div className="text-xs sm:text-sm text-gray-600">Publications</div>
                      </div>
                      <div className="text-center p-2 sm:p-3">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">248</div>
                        <div className="text-xs sm:text-sm text-gray-600">Likes totaux</div>
                      </div>
                      <div className="text-center p-2 sm:p-3">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600">1.2k</div>
                        <div className="text-xs sm:text-sm text-gray-600">Vues totales</div>
                      </div>
                      <div className="text-center p-2 sm:p-3">
                        <div className="text-xl sm:text-2xl font-bold text-orange-600">45</div>
                        <div className="text-xs sm:text-sm text-gray-600">Commentaires</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Zone principale avec publications */}
            <div className="lg:col-span-3 order-2 lg:order-2">
              <UserPublications isOwnProfile={true} />
            </div>
          </div>
        </div>
      </div>

      {authModal.isOpen && (
        <AuthModal mode={authModal.mode} onClose={handleCloseAuth} />
      )}
    </div>
  );
};

export default Dashboard;
