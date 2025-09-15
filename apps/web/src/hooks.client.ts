import { supabase } from '$lib/supabaseClient';
import { sessionStore } from '$lib/auth/session';

async function initSession() {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  sessionStore.set(user ? { userId: user.id, email: user.email ?? undefined } : null);
}
initSession();

supabase.auth.onAuthStateChange((_evt, session) => {
  const user = session?.user;
  sessionStore.set(user ? { userId: user.id, email: user.email ?? undefined } : null);
});