
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CallState {
  callId: string | null;
  isInCall: boolean;
  isInitiating: boolean;
  isRinging: boolean;
  callType: 'audio' | 'video';
  remoteUserId: string | null;
  remoteUserName: string | null;
}

export const useWebRTCCall = (currentUserId: string) => {
  const [callState, setCallState] = useState<CallState>({
    callId: null,
    isInCall: false,
    isInitiating: false,
    isRinging: false,
    callType: 'video',
    remoteUserId: null,
    remoteUserName: null
  });

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  
  const { toast } = useToast();

  // Configuration STUN/TURN pour la connectivité internationale
  const rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  // Initialiser la connexion WebRTC
  const initializePeerConnection = useCallback(() => {
    if (peerConnection.current) return;

    peerConnection.current = new RTCPeerConnection(rtcConfiguration);

    peerConnection.current.onicecandidate = async (event) => {
      if (event.candidate && callState.callId) {
        try {
          await fetch('/functions/v1/webrtc-signaling', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'webrtc-candidate',
              callId: callState.callId,
              userId: currentUserId,
              candidate: event.candidate
            })
          });
        } catch (error) {
          console.error('Erreur envoi ICE candidate:', error);
        }
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log('Stream distant reçu');
      setRemoteStream(event.streams[0]);
    };

  }, [callState.callId, currentUserId]);

  // Démarrer un appel
  const startCall = async (targetUserId: string, targetUserName: string, callType: 'audio' | 'video' = 'video') => {
    try {
      const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      setCallState(prev => ({
        ...prev,
        callId,
        isInitiating: true,
        callType,
        remoteUserId: targetUserId,
        remoteUserName: targetUserName
      }));

      // obtenir le stream local
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true
      });
      
      setLocalStream(stream);

      // Initialiser WebRTC
      initializePeerConnection();
      
      // Ajouter le stream local à la connexion
      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });

      // Créer l'offre WebRTC
      const offer = await peerConnection.current!.createOffer();
      await peerConnection.current!.setLocalDescription(offer);

      // Initier l'appel via le serveur de signaling
      const response = await fetch('/functions/v1/webrtc-signaling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'call-initiate',
          callId,
          userId: currentUserId,
          targetUserId,
          offer
        })
      });

      if (!response.ok) throw new Error('Erreur initiation appel');

      // Envoyer l'offre WebRTC
      await fetch('/functions/v1/webrtc-signaling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'webrtc-offer',
          callId,
          userId: currentUserId,
          offer
        })
      });

      toast({
        title: 'Appel en cours...',
        description: `Appel ${callType} vers ${targetUserName}`
      });

    } catch (error) {
      console.error('Erreur démarrage appel:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de démarrer l\'appel',
        variant: 'destructive'
      });
      endCall();
    }
  };

  // Répondre à un appel
  const answerCall = async () => {
    try {
      if (!callState.callId) return;

      // Obtenir le stream local
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callState.callType === 'video',
        audio: true
      });
      
      setLocalStream(stream);

      // Ajouter le stream local
      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });

      // Accepter l'appel
      await fetch('/functions/v1/webrtc-signaling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'call-answer',
          callId: callState.callId,
          userId: currentUserId
        })
      });

      setCallState(prev => ({
        ...prev,
        isInCall: true,
        isRinging: false
      }));

      toast({
        title: 'Appel accepté',
        description: 'Communication établie'
      });

    } catch (error) {
      console.error('Erreur réponse appel:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de répondre à l\'appel',
        variant: 'destructive'
      });
    }
  };

  // Terminer un appel
  const endCall = async () => {
    try {
      if (callState.callId) {
        await fetch('/functions/v1/webrtc-signaling', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'call-end',
            callId: callState.callId,
            userId: currentUserId
          })
        });
      }

      // Nettoyer les streams
      localStream?.getTracks().forEach(track => track.stop());
      remoteStream?.getTracks().forEach(track => track.stop());
      
      // Fermer la connexion WebRTC
      peerConnection.current?.close();
      peerConnection.current = null;

      setLocalStream(null);
      setRemoteStream(null);
      setCallState({
        callId: null,
        isInCall: false,
        isInitiating: false,
        isRinging: false,
        callType: 'video',
        remoteUserId: null,
        remoteUserName: null
      });

    } catch (error) {
      console.error('Erreur fin appel:', error);
    }
  };

  // Écouter les événements de signaling
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(`user_${currentUserId}`)
      .on('broadcast', { event: 'incoming_call' }, ({ payload }) => {
        setCallState(prev => ({
          ...prev,
          callId: payload.callId,
          isRinging: true,
          remoteUserId: payload.callerId,
          remoteUserName: payload.callerName,
          callType: 'video'
        }));

        initializePeerConnection();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, initializePeerConnection]);

  // Écouter les événements WebRTC
  useEffect(() => {
    if (!callState.callId) return;

    const channel = supabase
      .channel(`call_${callState.callId}`)
      .on('broadcast', { event: 'webrtc_offer' }, async ({ payload }) => {
        if (payload.from !== currentUserId && peerConnection.current) {
          await peerConnection.current.setRemoteDescription(payload.offer);
          
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          await fetch('/functions/v1/webrtc-signaling', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'webrtc-answer',
              callId: callState.callId,
              userId: currentUserId,
              answer
            })
          });
        }
      })
      .on('broadcast', { event: 'webrtc_answer' }, async ({ payload }) => {
        if (payload.from !== currentUserId && peerConnection.current) {
          await peerConnection.current.setRemoteDescription(payload.answer);
          setCallState(prev => ({ ...prev, isInCall: true, isInitiating: false }));
        }
      })
      .on('broadcast', { event: 'webrtc_candidate' }, async ({ payload }) => {
        if (payload.from !== currentUserId && peerConnection.current) {
          await peerConnection.current.addIceCandidate(payload.candidate);
        }
      })
      .on('broadcast', { event: 'call_ended' }, () => {
        endCall();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callState.callId, currentUserId]);

  return {
    callState,
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    endCall
  };
};
