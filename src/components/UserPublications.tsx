import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image, Video, Music, Tv, Megaphone, Crown } from 'lucide-react';
import { usePublications } from '@/hooks/usePublications';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import CreatePublication from './CreatePublication';
import PublicationCard from './PublicationCard';
import SubscriptionButton from './SubscriptionButton';

interface UserPublicationsProps {
  userId?: string;
  isOwnProfile?: boolean;
}

const UserPublications = ({ userId, isOwnProfile = false }: UserPublicationsProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const { publications, isLoading, likePublication, updatePublication } = usePublications(userId);
  const { subscribed, loading: subscriptionLoading } = useSubscription();
  const { user } = useAuth();

  const handleLike = (publicationId: string) => {
    likePublication.mutate(publicationId);
  };

  const handleEdit = (publicationId: string, updates: any) => {
    updatePublication.mutate({ id: publicationId, ...updates });
  };

  const filterPublications = (contentType?: string) => {
    if (!publications) return [];
    if (contentType === 'all') return publications;
    return publications.filter(pub => pub.content_type === contentType);
  };

  const getTabCount = (contentType: string) => {
    return filterPublications(contentType).length;
  };

  // Show subscription required message for own profile if not subscribed
  if (isOwnProfile && !subscriptionLoading && !subscribed) {
    return (
      <div className="w-full space-y-4 sm:space-y-6">
        <div className="text-center py-6 sm:py-8 lg:py-12 px-3 sm:px-4">
          <Crown className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-blue-500 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
            Abonnement Premium Requis
          </h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Pour créer et publier du contenu, vous devez avoir un abonnement premium actif.
          </p>
          <div className="max-w-sm sm:max-w-md mx-auto">
            <SubscriptionButton />
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm && isOwnProfile && subscribed) {
    return <CreatePublication onClose={() => setShowCreateForm(false)} />;
  }

  return (
    <div className="w-full space-y-3 sm:space-y-4 lg:space-y-6">
      {isOwnProfile && subscribed && (
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 px-2 sm:px-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Mes Publications</h2>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 w-full sm:w-auto py-3 sm:py-2 text-base sm:text-sm touch-manipulation"
            style={{ minHeight: '44px' }}
          >
            <Plus className="h-4 w-4" />
            Nouvelle publication
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tabs horizontalement scrollables sur mobile */}
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid grid-cols-6 w-max sm:w-full min-w-full gap-1">
            <TabsTrigger value="all" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <span>Tout</span>
              <span className="hidden sm:inline">({publications?.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="photo" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <Image className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Photos</span>
              <span className="sm:hidden">P</span>
              <span className="hidden sm:inline">({getTabCount('photo')})</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <Video className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Vidéos</span>
              <span className="sm:hidden">V</span>
              <span className="hidden sm:inline">({getTabCount('video')})</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <Music className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Musique</span>
              <span className="sm:hidden">M</span>
              <span className="hidden sm:inline">({getTabCount('music')})</span>
            </TabsTrigger>
            <TabsTrigger value="series" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <Tv className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Séries</span>
              <span className="sm:hidden">S</span>
              <span className="hidden sm:inline">({getTabCount('series')})</span>
            </TabsTrigger>
            <TabsTrigger value="announcement" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <Megaphone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Annonces</span>
              <span className="sm:hidden">A</span>
              <span className="hidden sm:inline">({getTabCount('announcement')})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {(['all', 'photo', 'video', 'music', 'series', 'announcement'] as const).map((contentType) => (
          <TabsContent key={contentType} value={contentType} className="space-y-3 sm:space-y-4">
            {isLoading ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-gray-500 text-sm sm:text-base">Chargement des publications...</p>
              </div>
            ) : filterPublications(contentType).length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {filterPublications(contentType).map((publication) => (
                  <PublicationCard
                    key={publication.id}
                    publication={publication}
                    onLike={handleLike}
                    onEdit={handleEdit}
                    onComment={(id) => console.log('Comment on:', id)}
                    onShare={(id) => console.log('Share:', id)}
                    isOwnPublication={user?.id === publication.user_id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 lg:py-12 px-3 sm:px-4">
                <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">
                  {contentType === 'all' ? 'Aucune publication' : `Aucune ${contentType === 'photo' ? 'photo' : contentType === 'video' ? 'vidéo' : contentType === 'music' ? 'musique' : contentType === 'series' ? 'série' : 'annonce'}`}
                </p>
                {isOwnProfile && subscribed && (
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    variant="outline"
                    className="flex items-center gap-2 mx-auto py-3 text-base touch-manipulation"
                    style={{ minHeight: '44px' }}
                  >
                    <Plus className="h-4 w-4" />
                    Créer votre première publication
                  </Button>
                )}
                {isOwnProfile && !subscribed && !subscriptionLoading && (
                  <div className="max-w-sm sm:max-w-md mx-auto">
                    <p className="text-sm text-gray-500 mb-4">
                      Abonnez-vous pour commencer à publier
                    </p>
                    <SubscriptionButton />
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default UserPublications;
