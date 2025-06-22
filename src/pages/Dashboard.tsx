
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
      
      <div className="pt-16 sm:pt-18 lg:pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="mb-4 sm:mb-6 lg:mb-8 px-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
            <p className="text-gray-600 text-sm sm:text-base">Gérez vos publications et votre contenu</p>
          </div>

          <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6">
            <div className="lg:col-span-1 lg:order-1">
              <div className="space-y-4">
                <div className="w-full">
                  <SubscriptionButton />
                </div>
                
                <Card className="w-full">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-sm sm:text-base lg:text-lg">Mes statistiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2 sm:gap-3 lg:gap-4">
                      <div className="text-center p-2 sm:p-3">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">12</div>
                        <div className="text-xs sm:text-sm text-gray-600">Publications</div>
                      </div>
                      <div className="text-center p-2 sm:p-3">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">248</div>
                        <div className="text-xs sm:text-sm text-gray-600">Likes totaux</div>
                      </div>
                      <div className="text-center p-2 sm:p-3">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">1.2k</div>
                        <div className="text-xs sm:text-sm text-gray-600">Vues totales</div>
                      </div>
                      <div className="text-center p-2 sm:p-3">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">45</div>
                        <div className="text-xs sm:text-sm text-gray-600">Commentaires</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-3 lg:order-2">
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
