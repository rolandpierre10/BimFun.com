
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PublicationCard from './PublicationCard';
import { Publication } from '@/hooks/usePublications';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

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
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune publication disponible</p>
          <p className="text-gray-400 mt-2">Soyez le premier à publier du contenu !</p>
        </div>
      )}
    </div>
  );
};

export default PublicFeed;
