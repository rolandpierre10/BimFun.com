
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Wifi, WifiOff } from 'lucide-react';

const OnlineStatusToggle = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);

  // Récupérer le statut actuel de l'utilisateur
  useEffect(() => {
    if (!user) return;

    const fetchUserStatus = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_online')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user status:', error);
        return;
      }

      if (data) {
        setIsOnline(data.is_online || false);
      }
    };

    fetchUserStatus();
  }, [user]);

  // Mettre automatiquement l'utilisateur en ligne lors de la connexion
  useEffect(() => {
    if (!user) return;

    const setUserOnline = async () => {
      await supabase
        .from('profiles')
        .update({ is_online: true })
        .eq('id', user.id);
      setIsOnline(true);
    };

    setUserOnline();

    // Mettre l'utilisateur hors ligne quand il quitte la page
    const handleBeforeUnload = async () => {
      await supabase
        .from('profiles')
        .update({ is_online: false })
        .eq('id', user.id);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Mettre hors ligne lors du démontage du composant
      if (user) {
        supabase
          .from('profiles')
          .update({ is_online: false })
          .eq('id', user.id);
      }
    };
  }, [user]);

  const toggleOnlineStatus = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const newStatus = !isOnline;
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_online: newStatus })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setIsOnline(newStatus);
      toast({
        title: newStatus ? "Vous êtes maintenant en ligne" : "Vous êtes maintenant hors ligne",
        description: newStatus ? "Votre statut est visible par les autres utilisateurs" : "Vous apparaissez comme hors ligne",
      });
    } catch (error) {
      console.error('Error updating online status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre statut",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center gap-1">
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
      </Badge>
      
      <Button
        size="sm"
        variant={isOnline ? "outline" : "default"}
        onClick={toggleOnlineStatus}
        disabled={loading}
        className="flex items-center gap-1"
      >
        {isOnline ? (
          <>
            <WifiOff className="h-4 w-4" />
            Se déconnecter
          </>
        ) : (
          <>
            <Wifi className="h-4 w-4" />
            Se connecter
          </>
        )}
      </Button>
    </div>
  );
};

export default OnlineStatusToggle;
