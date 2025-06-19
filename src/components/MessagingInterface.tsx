
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Video, Phone, Send, VideoOff, Image } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import VoiceRecorder from './VoiceRecorder';
import { supabase } from '@/integrations/supabase/client';

interface MessagingInterfaceProps {
  userName: string;
  userId?: string;
  onClose?: () => void;
}

const MessagingInterface = ({ userName, userId, onClose }: MessagingInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isAudioCall, setIsAudioCall] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const { 
    messages, 
    isLoading, 
    sendTextMessage, 
    uploadMediaMessage,
    subscribeToMessages 
  } = useMessaging();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (user) {
        const unsubscribe = subscribeToMessages(user.id);
        return unsubscribe;
      }
    };
    
    getUser();
  }, []);

  const sendMessage = async () => {
    if (message.trim() && userId) {
      await sendTextMessage(userId, message);
      setMessage('');
    }
  };

  const handleVoiceMessage = async (audioBlob: Blob, duration: number) => {
    if (userId) {
      const audioFile = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });
      await uploadMediaMessage(userId, audioFile, 'voice', duration);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userId) {
      await uploadMediaMessage(userId, file, 'image');
    }
  };

  const startVideoCall = () => {
    setIsVideoCall(!isVideoCall);
    console.log('Appel vidéo:', !isVideoCall ? 'démarré' : 'terminé');
  };

  const startAudioCall = () => {
    setIsAudioCall(!isAudioCall);
    console.log('Appel audio:', !isAudioCall ? 'démarré' : 'terminé');
  };

  const renderMessage = (msg: any) => {
    const isOwn = msg.sender_id === currentUser?.id;
    
    return (
      <div
        key={msg.id}
        className={`mb-4 flex ${isOwn ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-xs p-3 rounded-lg ${
            isOwn
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-200'
          }`}
        >
          {msg.message_type === 'text' && (
            <p className="text-sm">{msg.content}</p>
          )}
          
          {msg.message_type === 'voice' && (
            <div className="space-y-2">
              <audio controls className="w-full">
                <source src={msg.media_url} type="audio/wav" />
              </audio>
              {msg.duration_seconds && (
                <span className="text-xs opacity-70">
                  {Math.floor(msg.duration_seconds / 60)}:{(msg.duration_seconds % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
          )}
          
          {msg.message_type === 'image' && (
            <img 
              src={msg.media_url} 
              alt="Image partagée" 
              className="max-w-full h-auto rounded"
            />
          )}
          
          {msg.message_type === 'video' && (
            <video controls className="max-w-full h-auto rounded">
              <source src={msg.media_url} type="video/mp4" />
            </video>
          )}
          
          <span className="text-xs opacity-70 mt-1 block">
            {new Date(msg.created_at).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gray-900 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversation avec {userName}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isAudioCall ? "destructive" : "secondary"}
              onClick={startAudioCall}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={isVideoCall ? "destructive" : "secondary"}
              onClick={startVideoCall}
            >
              {isVideoCall ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </Button>
            {onClose && (
              <Button size="sm" variant="outline" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Zone des messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map(renderMessage)}
        </div>

        {/* Interface d'appel vidéo/audio */}
        {(isVideoCall || isAudioCall) && (
          <div className="p-4 bg-gray-900 text-white text-center">
            <p className="mb-2">
              {isVideoCall ? 'Appel vidéo' : 'Appel audio'} en cours avec {userName}...
            </p>
            <div className="flex justify-center gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={isVideoCall ? startVideoCall : startAudioCall}
              >
                Raccrocher
              </Button>
            </div>
          </div>
        )}

        {/* Zone de saisie */}
        <div className="p-4 border-t">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Textarea
                placeholder="Tapez votre message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[60px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <VoiceRecorder
                onSendVoiceMessage={handleVoiceMessage}
                isRecording={isRecording}
                onRecordingStateChange={setIsRecording}
              />
              
              <label className="cursor-pointer">
                <Button size="sm" variant="outline" asChild>
                  <span>
                    <Image className="h-4 w-4" />
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              <Button 
                size="sm" 
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagingInterface;
