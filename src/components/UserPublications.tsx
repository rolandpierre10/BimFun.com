
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image, Video, Music, Tv, Megaphone, Crown } from 'lucide-react';
import { usePublications } from '@/hooks/usePublications';
import { useSubscription } from '@/hooks/useSubscription';
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
  
  const { publications, isLoading, likePublication } = usePublications(userId);
  const { subscribed, loading: subscriptionLoading } = useSubscription();

  const handleLike = (publicationId: string) => {
    likePublication.mutate(publicationId);
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
      <div className="w-full space-y-6">
        <div className="text-center py-12">
          <Crown className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Abonnement Premium Requis
          </h2>
          <p className="text-gray-600 mb-6">
            Pour créer et publier du contenu, vous devez avoir un abonnement premium actif.
          </p>
          <div className="max-w-md mx-auto">
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
    <div className="w-full space-y-6">
      {isOwnProfile && subscribed && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Mes Publications</h2>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle publication
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all" className="flex items-center gap-2">
            Tout ({publications?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="photo" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Photos ({getTabCount('photo')})
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Vidéos ({getTabCount('video')})
          </TabsTrigger>
          <TabsTrigger value="music" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Musique ({getTabCount('music')})
          </TabsTrigger>
          <TabsTrigger value="series" className="flex items-center gap-2">
            <Tv className="h-4 w-4" />
            Séries ({getTabCount('series')})
          </TabsTrigger>
          <TabsTrigger value="announcement" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Annonces ({getTabCount('announcement')})
          </TabsTrigger>
        </TabsList>

        {(['all', 'photo', 'video', 'music', 'series', 'announcement'] as const).map((contentType) => (
          <TabsContent key={contentType} value={contentType} className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chargement des publications...</p>
              </div>
            ) : filterPublications(contentType).length > 0 ? (
              <div className="space-y-4">
                {filterPublications(contentType).map((publication) => (
                  <PublicationCard
                    key={publication.id}
                    publication={publication}
                    onLike={handleLike}
                    onComment={(id) => console.log('Comment on:', id)}
                    onShare={(id) => console.log('Share:', id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {contentType === 'all' ? 'Aucune publication' : `Aucune ${contentType === 'photo' ? 'photo' : contentType === 'video' ? 'vidéo' : contentType === 'music' ? 'musique' : contentType === 'series' ? 'série' : 'annonce'}`}
                </p>
                {isOwnProfile && subscribed && (
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Créer votre première publication
                  </Button>
                )}
                {isOwnProfile && !subscribed && !subscriptionLoading && (
                  <div className="max-w-md mx-auto">
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
