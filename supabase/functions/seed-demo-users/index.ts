import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log('Creating demo users...');

    const demoUsers = [
      {
        email: 'joe@example.com',
        password: 'joe',
        full_name: 'Joe Demo',
      },
      {
        email: 'jane@example.com',
        password: 'jane',
        full_name: 'Jane Demo',
      },
    ];

    const results = [];

    for (const demoUser of demoUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const userExists = existingUsers?.users?.some(u => u.email === demoUser.email);

      if (userExists) {
        console.log(`User ${demoUser.email} already exists, skipping...`);
        results.push({ email: demoUser.email, status: 'already_exists' });
        continue;
      }

      // Create the user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: demoUser.email,
        password: demoUser.password,
        email_confirm: true,
        user_metadata: {
          full_name: demoUser.full_name,
        },
      });

      if (error) {
        console.error(`Error creating user ${demoUser.email}:`, error);
        results.push({ email: demoUser.email, status: 'error', error: error.message });
      } else {
        console.log(`Successfully created user ${demoUser.email}`);
        results.push({ email: demoUser.email, status: 'created', user_id: data.user?.id });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Demo users seeding completed',
        results 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error seeding demo users:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
