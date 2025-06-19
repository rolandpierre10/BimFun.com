
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mic, Video, Phone, Send, MicOff, VideoOff } from 'lucide-react';

interface MessagingInterfaceProps {
  userName: string;
  onClose?: () => void;
}

const MessagingInterface = ({ userName, onClose }: MessagingInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isAudioCall, setIsAudioCall] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: `Bonjour ! Comment allez-vous ?`, sender: userName, time: '10:30' },
    { id: 2, text: `Salut ${userName} ! Ça va bien, merci. Et vous ?`, sender: 'Vous', time: '10:32' }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'Vous',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(!isRecording);
    // Logique d'enregistrement vocal à implémenter
    console.log('Enregistrement vocal:', !isRecording ? 'démarré' : 'arrêté');
  };

  const startVideoCall = () => {
    setIsVideoCall(!isVideoCall);
    console.log('Appel vidéo:', !isVideoCall ? 'démarré' : 'terminé');
  };

  const startAudioCall = () => {
    setIsAudioCall(!isAudioCall);
    console.log('Appel audio:', !isAudioCall ? 'démarré' : 'terminé');
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
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${msg.sender === 'Vous' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.sender === 'Vous'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
              </div>
            </div>
          ))}
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
              <Button
                size="sm"
                variant={isRecording ? "destructive" : "outline"}
                onClick={startVoiceRecording}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button size="sm" onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isRecording && (
            <p className="text-sm text-red-600 mt-2 text-center">
              🔴 Enregistrement en cours...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagingInterface;
