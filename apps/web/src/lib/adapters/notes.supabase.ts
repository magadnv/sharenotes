import { supabase } from '$lib/supabaseClient';
import type { NoteSummary, NoteDetail } from '$lib/types/notes';

export async function searchNotes(q: string): Promise<NoteSummary[]> {
  if (!q?.trim()) return [];
  const like = `%${q}%`;
  const { data, error } = await supabase
    .from('notes')
    .select('id, title, excerpt, subject, helpful_count, created_at')
  //  .eq('is_public', true)           // falls Spalte existiert; sonst entferne diese Zeile
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

// Optional – erst nutzen, wenn RPC/Policies stehen
export async function markHelpful(_id: string): Promise<boolean> {
  return true;
}