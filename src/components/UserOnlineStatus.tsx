
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Wifi, WifiOff } from 'lucide-react';

interface UserOnlineStatusProps {
  userId: string;
  showAsButton?: boolean;
}

const UserOnlineStatus = ({ userId, showAsButton = true }: UserOnlineStatusProps) => {
  const [isOnline, setIsOnline] = useState(false);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!userId || isSubscribedRef.current) return;

    const fetchUserStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_online')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user status:', error);
          return;
        }

        if (data) {
          setIsOnline(data.is_online || false);
        }
      } catch (error) {
        console.error('Error in fetchUserStatus:', error);
      }
    };

    fetchUserStatus();

    // Nettoyer le canal précédent s'il existe
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    // Créer un nouveau canal avec un nom unique
    const channelName = `user-status-${userId}-${Math.random().toString(36).substr(2, 9)}`;
    
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) {
            setIsOnline(payload.new.is_online || false);
          }
        }
      );

    // S'abonner seulement si pas déjà abonné
    if (!isSubscribedRef.current) {
      channelRef.current.subscribe();
      isSubscribedRef.current = true;
    }

    return () => {
      if (channelRef.current && isSubscribedRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [userId]);

  if (showAsButton) {
    return (
      <Button
        size="sm"
        variant={isOnline ? "default" : "secondary"}
        className="flex items-center gap-1"
        disabled
      >
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            En ligne
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            Hors ligne
          </>
        )}
      </Button>
    );
  }

  return (
    <span className={`flex items-center gap-1 text-sm ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3" />
          En ligne
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Hors ligne
        </>
      )}
    </span>
  );
};

export default UserOnlineStatus;
