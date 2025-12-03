import { supabase } from '$lib/supabaseClient';
import type { NoteSummary, NoteDetail } from '$lib/types/notes';

export async function searchNotes(q: string): Promise<NoteSummary[]> {
  if (!q?.trim()) return [];
  const like = `%${q}%`;
  const { data, error } = await supabase
    .from('notes')
    .select('id, title, excerpt, subject, helpful_count, created_at')
    // .eq('is_public', true) // falls du eine is_public-Spalte hast
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
    // PGRST116 = Row not found
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
 * Markiert eine Notiz als hilfreich.
 * Nutzt die Tabelle note_helpful + Trigger auf notes.helpful_count.
 * Gibt den aktuellen helpful_count zurück.
 */
export async function markHelpful(noteId: string): Promise<number> {
  // 1. Sicherstellen, dass ein User eingeloggt ist
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Nur angemeldete Nutzer können Notizen als hilfreich markieren.');
  }

  // 2. Versuch, eine neue Reaktion anzulegen
  const { error: insertError } = await supabase
    .from('note_helpful')
    .insert({ note_id: noteId, user_id: user.id });

  // UNIQUE-Verletzung (= Nutzer hat schon geklickt) ignorieren wir
  if (insertError && (insertError as any).code !== '23505') {
    // 23505 = unique_violation
    throw insertError;
  }

  // 3. Aktuellen helpful_count aus notes lesen (Trigger hat ihn aktualisiert)
  const { data, error: countError } = await supabase
    .from('notes')
    .select('helpful_count')
    .eq('id', noteId)
    .single();

  if (countError) throw countError;

  return data?.helpful_count ?? 0;
}