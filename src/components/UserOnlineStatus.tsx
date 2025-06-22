
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Wifi, WifiOff } from 'lucide-react';

interface UserOnlineStatusProps {
  userId: string;
  showAsButton?: boolean;
}

const UserOnlineStatus = ({ userId, showAsButton = true }: UserOnlineStatusProps) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) return;

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

    // Create a unique channel name to avoid conflicts
    const channelName = `user-status-${userId}-${Date.now()}`;
    
    // Écouter les mises à jour en temps réel
    const channel = supabase
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
      )
      .subscribe();

    return () => {
      // Proper cleanup
      supabase.removeChannel(channel);
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
