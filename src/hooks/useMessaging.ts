
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string | null;
  message_type: 'text' | 'voice' | 'video' | 'image';
  media_url: string | null;
  duration_seconds: number | null;
  file_size: number | null;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string;
  last_message_id: string | null;
  created_at: string;
}

export const useMessaging = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendTextMessage = async (receiverId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data as Message]);
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message',
        variant: 'destructive'
      });
    }
  };

  const uploadMediaMessage = async (
    receiverId: string, 
    file: File, 
    messageType: 'voice' | 'video' | 'image',
    duration?: number
  ) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-messages')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media-messages')
        .getPublicUrl(fileName);

      // Save message to database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          message_type: messageType,
          media_url: publicUrl,
          file_size: file.size,
          duration_seconds: duration || null
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data as Message]);
      toast({
        title: 'Succès',
        description: 'Fichier envoyé avec succès'
      });
      
      return data;
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le fichier',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConversationMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${conversationId},receiver_id.eq.${conversationId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = (userId: string) => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    messages,
    conversations,
    isLoading,
    sendTextMessage,
    uploadMediaMessage,
    getConversationMessages,
    subscribeToMessages
  };
};
