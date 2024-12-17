import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token, verifyOnly } = await req.json()
    const YOCO_SECRET_KEY = Deno.env.get('YOCO_SECRET_KEY')

    if (!YOCO_SECRET_KEY) {
      throw new Error('Missing Yoco secret key')
    }

    console.log('Verifying card token:', token);

    // Use Yoco's verify endpoint
    const response = await fetch('https://online.yoco.com/v1/tokens/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOCO_SECRET_KEY}`
      },
      body: JSON.stringify({
        token,
      })
    });

    const result = await response.json();
    console.log('Yoco API response:', result);

    if (!response.ok) {
      throw new Error(result.message || 'Failed to verify card');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Card verified successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})