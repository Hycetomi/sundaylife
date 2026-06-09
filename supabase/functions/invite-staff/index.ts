import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Verify caller is an Admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    const { data: { user: caller }, error: authErr } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', ''),
    );
    if (authErr || !caller) return json({ error: 'Unauthorized' }, 401);

    const { data: callerProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single();

    if (callerProfile?.role !== 'Admin') return json({ error: 'Admin access required' }, 403);

    const { email, full_name, role, department_id } = await req.json();

    if (!email || !full_name || !role) {
      return json({ error: 'email, full_name, and role are required' }, 400);
    }

    if (!['Admin', 'Lead', 'Volunteer'].includes(role)) {
      return json({ error: 'Invalid role' }, 400);
    }

    const siteUrl = Deno.env.get('SITE_URL') ?? '';

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data:       { full_name, role, department_id: department_id || null },
      redirectTo: `${siteUrl}/register`,
    });

    if (error) return json({ error: error.message }, 400);

    return json({ success: true, userId: data.user.id });

  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
