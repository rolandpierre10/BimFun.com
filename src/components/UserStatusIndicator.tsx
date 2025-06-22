
import React, { useState, useEffect, useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Wifi, WifiOff } from 'lucide-react';

interface UserStatusIndicatorProps {
  userId: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const UserStatusIndicator = ({ userId, showText = true, size = 'md' }: UserStatusIndicatorProps) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!userId || isSubscribedRef.current) return;

    const fetchUserStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_online, last_seen')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user status:', error);
          return;
        }

        if (data) {
          setIsOnline(data.is_online || false);
          setLastSeen(data.last_seen);
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
    const channelName = `user-status-indicator-${userId}-${Math.random().toString(36).substr(2, 9)}`;

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
            setLastSeen(payload.new.last_seen);
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

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-2 w-2';
      case 'lg': return 'h-4 w-4';
      default: return 'h-3 w-3';
    }
  };

  const formatLastSeen = (lastSeenDate: string) => {
    const date = new Date(lastSeenDate);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays}j`;
  };

  if (isOnline) {
    return (
      <Badge variant="default" className="flex items-center gap-1">
        <Wifi className={getIconSize()} />
        {showText && 'En ligne'}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <WifiOff className={getIconSize()} />
      {showText && (lastSeen ? formatLastSeen(lastSeen) : 'Hors ligne')}
    </Badge>
  );
};

export default UserStatusIndicator;
