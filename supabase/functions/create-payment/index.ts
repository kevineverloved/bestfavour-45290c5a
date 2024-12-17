import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'ZAR' } = await req.json()
    const YOCO_SECRET_KEY = Deno.env.get('YOCO_SECRET_KEY')

    if (!YOCO_SECRET_KEY) {
      throw new Error('Missing Yoco secret key')
    }

    // TODO: Implement Yoco payment creation
    // This is a placeholder for now
    console.log('Creating payment with Yoco:', { amount, currency })

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment initiated',
        data: { amount, currency }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        message: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})