
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Video, Phone, Send, VideoOff, Image, X } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { useWebRTCCall } from '@/hooks/useWebRTCCall';
import VoiceRecorder from './VoiceRecorder';
import VideoCallInterface from './VideoCallInterface';
import EmojiPicker from './EmojiPicker';
import GifPicker from './GifPicker';
import { supabase } from '@/integrations/supabase/client';

interface MessagingInterfaceProps {
  userName: string;
  userId?: string;
  onClose?: () => void;
}

const MessagingInterface = ({ userName, userId, onClose }: MessagingInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  
  const { 
    messages, 
    isLoading, 
    sendTextMessage, 
    uploadMediaMessage,
    subscribeToMessages 
  } = useMessaging();

  const { callState, startCall } = useWebRTCCall(currentUser?.id || '');

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
    if ((message.trim() || selectedGif) && userId) {
      if (selectedGif) {
        // Send GIF URL as text message with special type
        await uploadMediaMessage(userId, selectedGif, 'gif');
        setSelectedGif(null);
      } else {
        await sendTextMessage(userId, message);
      }
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

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleGifSelect = (gifUrl: string) => {
    setSelectedGif(gifUrl);
  };

  const startVideoCall = () => {
    if (userId && currentUser) {
      startCall(userId, userName, 'video');
    }
  };

  const startAudioCall = () => {
    if (userId && currentUser) {
      startCall(userId, userName, 'audio');
    }
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
          
          {msg.message_type === 'gif' && (
            <img 
              src={msg.media_url || msg.content} 
              alt="GIF" 
              className="max-w-full h-auto rounded"
            />
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

  // Afficher l'interface d'appel si un appel est en cours
  if (callState.isInCall || callState.isInitiating || callState.isRinging) {
    return <VideoCallInterface currentUserId={currentUser?.id || ''} onCallEnd={onClose} />;
  }

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
              variant="secondary"
              onClick={startAudioCall}
              title="Appel audio"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={startVideoCall}
              title="Appel vidéo"
            >
              <Video className="h-4 w-4" />
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

        {/* Zone de saisie */}
        <div className="p-4 border-t">
          {selectedGif && (
            <div className="mb-2 relative inline-block">
              <img 
                src={selectedGif} 
                alt="GIF sélectionné" 
                className="h-20 rounded border"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                onClick={() => setSelectedGif(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
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
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              <GifPicker onGifSelect={handleGifSelect} />
              
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
                disabled={isLoading || (!message.trim() && !selectedGif)}
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
