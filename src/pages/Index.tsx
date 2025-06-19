
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PublicFeed from '@/components/PublicFeed';
import SubscriptionButton from '@/components/SubscriptionButton';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur BimFun
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            La plateforme sociale pour partager et découvrir du contenu créatif
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar avec abonnement */}
          <div className="lg:col-span-1 space-y-4">
            {user && <SubscriptionButton />}
          </div>

          {/* Zone principale avec le feed public */}
          <div className="lg:col-span-3">
            <PublicFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
