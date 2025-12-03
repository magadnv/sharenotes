import { supabase } from '$lib/supabaseClient';
import type { NoteSummary, NoteDetail } from '$lib/types/notes';

export async function searchNotes(q: string): Promise<NoteSummary[]> {
  if (!q?.trim()) return [];
  const like = `%${q}%`;
  const { data, error } = await supabase
    .from('notes')
    .select('id, title, excerpt, subject, helpful_count, created_at')
    // .eq('is_public', true)
    .or(`title.ilike.${like},excerpt.ilike.${like},subject.ilike.${like}`)
    .order('helpful_count', { ascending: false })
    .limit(50);

  if (error) throw error;

  return (data ?? []).map((n: any) => ({
    id: n.id,
    title: n.title,
    excerpt: n.excerpt,
    subject: n.subject,
    helpful: n.helpful_count,
    created_at: n.created_at
  }));
}

export async function getNoteById(id: string): Promise<NoteDetail | null> {
  const { data, error } = await supabase
    .from('notes')
    .select('id, title, excerpt, subject, content, helpful_count, created_at')
    .eq('id', id)
    .single();

  if (error) {
    if ((error as any).code === 'PGRST116') return null;
    throw error;
  }

  return data
    ? {
        id: data.id,
        title: data.title,
        excerpt: data.excerpt,
        subject: data.subject,
        content: data.content,
        helpful: data.helpful_count,
        created_at: data.created_at
      }
    : null;
}

/**
 * Toggle "hilfreich" für die aktuelle Nutzer:in.
 * - Wenn noch keine Reaktion existiert → anlegen
 * - Wenn bereits vorhanden → löschen
 * Rückgabe:
 *   { count: number; active: boolean }
 *   active = true, wenn nach dem Toggle ein Like von dieser Person existiert.
 *
 * Voraussetzung: Trigger auf note_helpful, der notes.helpful_count bei INSERT/DELETE anpasst.
 */
export async function markHelpful(
  noteId: string
): Promise<{ count: number; active: boolean }> {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Nur angemeldete Nutzer können Notizen als hilfreich markieren.');
  }

  // Existiert bereits ein Eintrag?
  const { data: existing, error: existingError } = await supabase
    .from('note_helpful')
    .select('id')
    .eq('note_id', noteId)
    .eq('user_id', user.id);

  if (existingError) throw existingError;

  const already = (existing ?? []).length > 0;

  if (!already) {
    // Noch kein Like → eintragen
    const { error: insertError } = await supabase
      .from('note_helpful')
      .insert({ note_id: noteId, user_id: user.id });

    if (insertError) throw insertError;
  } else {
    // Bereits gelikt → zurückziehen
    const { error: deleteError } = await supabase
      .from('note_helpful')
      .delete()
      .eq('note_id', noteId)
      .eq('user_id', user.id);

    if (deleteError) throw deleteError;
  }

  // Trigger hat helpful_count aktualisiert → aktuellen Stand lesen
  const { data: noteRow, error: countError } = await supabase
    .from('notes')
    .select('helpful_count')
    .eq('id', noteId)
    .single();

  if (countError) throw countError;

  return {
    count: noteRow?.helpful_count ?? 0,
    active: !already
  };
}