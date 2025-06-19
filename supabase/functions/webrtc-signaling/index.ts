
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { type, callId, userId, targetUserId, offer, answer, candidate } = await req.json()

    console.log('WebRTC Signaling:', { type, callId, userId, targetUserId })

    switch (type) {
      case 'call-initiate':
        // Créer un nouveau call dans la base de données
        const { data: callData, error: callError } = await supabaseClient
          .from('calls')
          .insert({
            id: callId,
            caller_id: userId,
            receiver_id: targetUserId,
            status: 'ringing',
            call_type: 'video'
          })
          .select()
          .single()

        if (callError) throw callError

        // Envoyer notification en temps réel au destinataire
        await supabaseClient
          .channel(`user_${targetUserId}`)
          .send({
            type: 'broadcast',
            event: 'incoming_call',
            payload: { callId, callerId: userId, callerName: 'Utilisateur' }
          })

        return new Response(JSON.stringify({ success: true, call: callData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'call-answer':
        // Mettre à jour le statut de l'appel
        await supabaseClient
          .from('calls')
          .update({ status: 'accepted' })
          .eq('id', callId)

        // Notifier l'appelant
        await supabaseClient
          .channel(`call_${callId}`)
          .send({
            type: 'broadcast',
            event: 'call_answered',
            payload: { callId }
          })

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'call-reject':
      case 'call-end':
        // Terminer l'appel
        await supabaseClient
          .from('calls')
          .update({ status: 'ended', ended_at: new Date().toISOString() })
          .eq('id', callId)

        // Notifier tous les participants
        await supabaseClient
          .channel(`call_${callId}`)
          .send({
            type: 'broadcast',
            event: 'call_ended',
            payload: { callId }
          })

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'webrtc-offer':
        // Transmettre l'offre WebRTC
        await supabaseClient
          .channel(`call_${callId}`)
          .send({
            type: 'broadcast',
            event: 'webrtc_offer',
            payload: { offer, from: userId }
          })

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'webrtc-answer':
        // Transmettre la réponse WebRTC
        await supabaseClient
          .channel(`call_${callId}`)
          .send({
            type: 'broadcast',
            event: 'webrtc_answer',
            payload: { answer, from: userId }
          })

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'webrtc-candidate':
        // Transmettre les candidats ICE
        await supabaseClient
          .channel(`call_${callId}`)
          .send({
            type: 'broadcast',
            event: 'webrtc_candidate',
            payload: { candidate, from: userId }
          })

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        throw new Error('Type de signaling non supporté')
    }

  } catch (error) {
    console.error('Erreur signaling WebRTC:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
