
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
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_online')
          .eq('id', userId)
          .single();

        if (error || !isMounted) return;
        if (data) {
          setIsOnline(data.is_online || false);
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };

    fetchStatus();

    // Setup realtime subscription
    const channel = supabase
      .channel(`user-status-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new && isMounted) {
            setIsOnline(payload.new.is_online || false);
          }
        }
      )
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
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
