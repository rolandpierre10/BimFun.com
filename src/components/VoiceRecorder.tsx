
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onSendVoiceMessage: (audioBlob: Blob, duration: number) => void;
  isRecording: boolean;
  onRecordingStateChange: (recording: boolean) => void;
}

const VoiceRecorder = ({ 
  onSendVoiceMessage, 
  isRecording, 
  onRecordingStateChange 
}: VoiceRecorderProps) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      onRecordingStateChange(true);

      // Start timer
      let seconds = 0;
      intervalRef.current = setInterval(() => {
        seconds++;
        setDuration(seconds);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'accéder au microphone',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      onRecordingStateChange(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const sendVoiceMessage = () => {
    if (audioBlob) {
      onSendVoiceMessage(audioBlob, duration);
      setAudioBlob(null);
      setDuration(0);
    }
  };

  const cancelRecording = () => {
    setAudioBlob(null);
    setDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioBlob) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
        <audio controls className="flex-1">
          <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
        </audio>
        <span className="text-sm text-gray-600">{formatDuration(duration)}</span>
        <Button size="sm" onClick={sendVoiceMessage}>
          <Send className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={cancelRecording}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={isRecording ? "destructive" : "outline"}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-red-600">{formatDuration(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
