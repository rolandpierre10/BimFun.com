
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PublicationCard from './PublicationCard';
import { Publication } from '@/hooks/usePublications';
import { Button } from "@/components/ui/button";
import { RefreshCw, Image, Users, Camera } from 'lucide-react';

const PublicFeed = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { data: publications, isLoading, refetch } = useQuery({
    queryKey: ['public-publications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('publications')
        .select(`
          *,
          profiles!publications_user_id_fkey (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as (Publication & { profiles: any })[];
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLike = async (publicationId: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    // Check if already liked
    const { data: existing } = await supabase
      .from('publication_interactions')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('publication_id', publicationId)
      .eq('interaction_type', 'like')
      .single();

    if (existing) {
      // Unlike
      await supabase
        .from('publication_interactions')
        .delete()
        .eq('id', existing.id);
    } else {
      // Like
      await supabase
        .from('publication_interactions')
        .insert([{
          user_id: user.user.id,
          publication_id: publicationId,
          interaction_type: 'like'
        }]);
    }

    refetch();
  };

  const handleDislike = async (publicationId: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    // Check if already disliked
    const { data: existing } = await supabase
      .from('publication_interactions')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('publication_id', publicationId)
      .eq('interaction_type', 'dislike')
      .single();

    if (existing) {
      // Remove dislike
      await supabase
        .from('publication_interactions')
        .delete()
        .eq('id', existing.id);
    } else {
      // Dislike
      await supabase
        .from('publication_interactions')
        .insert([{
          user_id: user.user.id,
          publication_id: publicationId,
          interaction_type: 'dislike'
        }]);
    }

    refetch();
  };

  const handleFollow = async (userId: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user || user.user.id === userId) return;

    // Check if already following
    const { data: existing } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', user.user.id)
      .eq('following_id', userId)
      .single();

    if (existing) {
      // Unfollow
      await supabase
        .from('followers')
        .delete()
        .eq('id', existing.id);
    } else {
      // Follow
      await supabase
        .from('followers')
        .insert([{
          follower_id: user.user.id,
          following_id: userId
        }]);
    }

    refetch();
  };

  const handleShare = (publicationId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Publication BimFun',
        url: `${window.location.origin}/publication/${publicationId}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/publication/${publicationId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Publications Publiques</h2>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {publications && publications.length > 0 ? (
        <div className="space-y-4">
          {publications.map((publication) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              userProfile={publication.profiles}
              onLike={handleLike}
              onDislike={handleDislike}
              onFollow={handleFollow}
              onShare={handleShare}
              showAllActions={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
          {/* Images grid */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <div className="aspect-square rounded-lg overflow-hidden shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop&crop=faces" 
                alt="Créatrice au travail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-lg transform -rotate-2 hover:rotate-1 transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop&crop=center" 
                alt="Technologie créative"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-lg transform rotate-1 hover:-rotate-2 transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop&crop=faces" 
                alt="Collaboration créative"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Icon and text content */}
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Aucune publication disponible
            </h3>
            <p className="text-gray-600 text-lg mb-4">
              Soyez le premier à partager votre créativité !
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
              <Image className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Photos & Vidéos</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
              <Users className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Communauté</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
              <Camera className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Créativité</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicFeed;
