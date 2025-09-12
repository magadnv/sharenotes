import * as supa from '$lib/adapters/notes.supabase';

export const NotesFacade = {
  search: (q: string) => supa.searchNotes(q),
  detail: (id: string) => supa.getNoteById(id),
  helpful: (id: string) => supa.markHelpful(id),
  topHelpful: async (limit = 6) => {
    const { data, error } = await (await import('$lib/supabaseClient')).supabase
      .from('notes')
      .select('id, title, excerpt, subject, helpful_count, created_at')
      .order('helpful_count', { ascending: false })
      .limit(limit);
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
};