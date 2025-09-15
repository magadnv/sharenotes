import { supabase } from '$lib/supabaseClient';

export async function upsertProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const display = user.email?.split('@')[0] ?? 'User';
  await supabase.from('profiles').upsert({ id: user.id, display_name: display }, { onConflict: 'id' });
}