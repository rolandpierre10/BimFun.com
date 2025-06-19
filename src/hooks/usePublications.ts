
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Publication {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  content_type: 'photo' | 'video' | 'music' | 'series' | 'announcement';
  media_urls: string[];
  tags: string[];
  is_public: boolean;
  likes_count: number;
  views_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export const usePublications = (userId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch publications - maintenant toujours publiques
  const { data: publications, isLoading } = useQuery({
    queryKey: ['publications', userId],
    queryFn: async () => {
      let query = supabase
        .from('publications')
        .select('*')
        .eq('is_public', true) // Toujours publique
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Publication[];
    },
  });

  // Create publication - toujours publique par défaut
  const createPublication = useMutation({
    mutationFn: async (publication: Omit<Publication, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'views_count' | 'comments_count'>) => {
      const { data, error } = await supabase
        .from('publications')
        .insert([{
          ...publication,
          is_public: true // Force toujours publique
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      queryClient.invalidateQueries({ queryKey: ['public-publications'] });
      toast({
        title: "Publication créée",
        description: "Votre contenu a été publié publiquement avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de publier le contenu",
        variant: "destructive",
      });
      console.error('Error creating publication:', error);
    },
  });

  // Upload media file
  const uploadMedia = async (file: File, contentType: string): Promise<string> => {
    const bucketMap = {
      photo: 'user-photos',
      video: 'user-videos',
      music: 'user-music',
      series: 'user-series'
    };

    const bucket = bucketMap[contentType as keyof typeof bucketMap] || 'user-photos';
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Like publication
  const likePublication = useMutation({
    mutationFn: async (publicationId: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('publication_interactions')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('publication_id', publicationId)
        .eq('interaction_type', 'like')
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('publication_interactions')
          .delete()
          .eq('id', existingLike.id);

        // Decrement likes count manually
        await supabase
          .from('publications')
          .update({ likes_count: Math.max(0, (publications?.find(p => p.id === publicationId)?.likes_count || 1) - 1) })
          .eq('id', publicationId);
      } else {
        // Remove any existing dislike first
        await supabase
          .from('publication_interactions')
          .delete()
          .eq('user_id', user.user.id)
          .eq('publication_id', publicationId)
          .eq('interaction_type', 'dislike');

        // Like
        await supabase
          .from('publication_interactions')
          .insert([{
            user_id: user.user.id,
            publication_id: publicationId,
            interaction_type: 'like'
          }]);

        // Increment likes count manually
        await supabase
          .from('publications')
          .update({ likes_count: (publications?.find(p => p.id === publicationId)?.likes_count || 0) + 1 })
          .eq('id', publicationId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      queryClient.invalidateQueries({ queryKey: ['public-publications'] });
    },
  });

  // Dislike publication
  const dislikePublication = useMutation({
    mutationFn: async (publicationId: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Check if already disliked
      const { data: existingDislike } = await supabase
        .from('publication_interactions')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('publication_id', publicationId)
        .eq('interaction_type', 'dislike')
        .single();

      if (existingDislike) {
        // Remove dislike
        await supabase
          .from('publication_interactions')
          .delete()
          .eq('id', existingDislike.id);
      } else {
        // Remove any existing like first
        const { data: existingLike } = await supabase
          .from('publication_interactions')
          .select('id')
          .eq('user_id', user.user.id)
          .eq('publication_id', publicationId)
          .eq('interaction_type', 'like')
          .single();

        if (existingLike) {
          await supabase
            .from('publication_interactions')
            .delete()
            .eq('id', existingLike.id);

          // Decrement likes count
          await supabase
            .from('publications')
            .update({ likes_count: Math.max(0, (publications?.find(p => p.id === publicationId)?.likes_count || 1) - 1) })
            .eq('id', publicationId);
        }

        // Dislike
        await supabase
          .from('publication_interactions')
          .insert([{
            user_id: user.user.id,
            publication_id: publicationId,
            interaction_type: 'dislike'
          }]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      queryClient.invalidateQueries({ queryKey: ['public-publications'] });
    },
  });

  return {
    publications,
    isLoading,
    createPublication,
    uploadMedia,
    likePublication,
    dislikePublication,
  };
};
