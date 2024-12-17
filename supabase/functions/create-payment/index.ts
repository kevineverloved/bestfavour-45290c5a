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
    const { token } = await req.json()
    const YOCO_SECRET_KEY = Deno.env.get('YOCO_SECRET_KEY')

    if (!YOCO_SECRET_KEY) {
      throw new Error('Missing Yoco secret key')
    }

    console.log('Verifying card token:', token);

    // Use Yoco's charge endpoint with a minimal amount for verification
    const response = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOCO_SECRET_KEY}`
      },
      body: JSON.stringify({
        token,
        amountInCents: 50, // Minimum amount required by Yoco (R0.50)
        currency: 'ZAR',
        metadata: {
          verifyOnly: true
        }
      })
    });

    const result = await response.json();
    console.log('Yoco API response:', result);

    if (!response.ok) {
      throw new Error(result.displayMessage || result.message || 'Failed to verify card');
    }

    // If successful, immediately refund the verification charge
    if (result.id) {
      const refundResponse = await fetch(`https://online.yoco.com/v1/refunds/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${YOCO_SECRET_KEY}`
        },
        body: JSON.stringify({
          chargeId: result.id
        })
      });
      
      const refundResult = await refundResponse.json();
      console.log('Refund response:', refundResult);
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