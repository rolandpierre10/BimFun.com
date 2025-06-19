
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { useWebRTCCall } from '@/hooks/useWebRTCCall';

interface VideoCallInterfaceProps {
  currentUserId: string;
  onCallEnd?: () => void;
}

const VideoCallInterface = ({ currentUserId, onCallEnd }: VideoCallInterfaceProps) => {
  const {
    callState,
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    answerCall,
    endCall
  } = useWebRTCCall(currentUserId);

  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);

  // Attacher les streams aux éléments vidéo
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Contrôler vidéo local
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Contrôler audio local
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    endCall();
    onCallEnd?.();
  };

  // Interface pour appel entrant
  if (callState.isRinging && !callState.isInCall) {
    return (
      <Card className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <CardContent className="text-center text-white p-8">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Video className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Appel entrant</h2>
            <p className="text-gray-300">
              {callState.remoteUserName} vous appelle
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 rounded-full p-4"
              onClick={answerCall}
            >
              <Phone className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="rounded-full p-4"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Interface pendant l'appel
  if (callState.isInCall || callState.isInitiating) {
    return (
      <Card className="fixed inset-0 z-50 bg-black">
        <CardContent className="h-full p-0 relative">
          {/* Vidéo distante (plein écran) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Vidéo locale (coin) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Informations sur l'appel */}
          <div className="absolute top-4 left-4 text-white">
            <h3 className="text-lg font-semibold">
              {callState.isInitiating ? 'Connexion...' : callState.remoteUserName}
            </h3>
            <p className="text-sm text-gray-300">
              {callState.isInitiating ? 'Appel en cours...' : 'En communication'}
            </p>
          </div>

          {/* Contrôles */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-4">
              <Button
                size="lg"
                variant={isVideoEnabled ? "secondary" : "destructive"}
                className="rounded-full p-4"
                onClick={toggleVideo}
              >
                {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
              </Button>
              
              <Button
                size="lg"
                variant={isAudioEnabled ? "secondary" : "destructive"}
                className="rounded-full p-4"
                onClick={toggleAudio}
              >
                {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
              </Button>
              
              <Button
                size="lg"
                variant="destructive"
                className="rounded-full p-4"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default VideoCallInterface;
