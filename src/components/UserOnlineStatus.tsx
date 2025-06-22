
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const userIdRef = useRef(userId);

  // Update ref when userId changes
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  const setupSubscription = useCallback(async () => {
    const currentUserId = userIdRef.current;
    if (!currentUserId || !mountedRef.current) return;

    // Cleanup existing subscription
    cleanup();

    try {
      // Fetch initial status
      const { data, error } = await supabase
        .from('profiles')
        .select('is_online')
        .eq('id', currentUserId)
        .single();

      if (error || !mountedRef.current) return;

      if (data) {
        setIsOnline(data.is_online || false);
      }

      // Setup realtime subscription
      const channelName = `user-status-${currentUserId}-${Date.now()}`;
      
      channelRef.current = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${currentUserId}`,
          },
          (payload) => {
            if (payload.new && mountedRef.current) {
              setIsOnline(payload.new.is_online || false);
            }
          }
        )
        .subscribe();
    } catch (error) {
      console.error('Error in setupSubscription:', error);
    }
  }, [cleanup]);

  useEffect(() => {
    mountedRef.current = true;
    setupSubscription();

    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [setupSubscription]);

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
