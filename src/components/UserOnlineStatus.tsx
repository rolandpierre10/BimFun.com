
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
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    const fetchUserStatus = async () => {
      if (!userId || !mountedRef.current) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_online')
          .eq('id', userId)
          .single();

        if (error || !mountedRef.current) return;

        if (data) {
          setIsOnline(data.is_online || false);
        }
      } catch (error) {
        console.error('Error in fetchUserStatus:', error);
      }
    };

    fetchUserStatus();

    // Nettoyer le canal précédent
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Créer un nouveau canal seulement si nécessaire
    if (userId && mountedRef.current) {
      const channelName = `user-status-${userId}`;
      
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
            if (payload.new && mountedRef.current) {
              setIsOnline(payload.new.is_online || false);
            }
          }
        )
        .subscribe();
    }

    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
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
