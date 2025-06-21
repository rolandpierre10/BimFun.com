
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFollowing = (targetUserId?: string) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (currentUser?.id && targetUserId) {
      checkFollowingStatus();
    }
  }, [currentUser?.id, targetUserId]);

  const checkFollowingStatus = async () => {
    if (!currentUser?.id || !targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', currentUser.id)
        .eq('following_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking follow status:', error);
        return;
      }

      setIsFollowing(!!data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const toggleFollow = async () => {
    if (!currentUser?.id || !targetUserId || isLoading) return;

    setIsLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', targetUserId);

        if (error) throw error;

        setIsFollowing(false);
        toast({
          title: "Désabonné",
          description: "Vous ne suivez plus cet utilisateur",
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('followers')
          .insert({
            follower_id: currentUser.id,
            following_id: targetUserId
          });

        if (error) throw error;

        setIsFollowing(true);
        toast({
          title: "Abonné",
          description: "Vous suivez maintenant cet utilisateur",
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de suivi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFollowing,
    isLoading,
    toggleFollow,
    canFollow: currentUser?.id && targetUserId && currentUser.id !== targetUserId
  };
};
