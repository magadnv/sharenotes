import {
  searchNotes as memSearch,
  getNoteById as memById,
  markHelpful as memHelpful,
  getTopHelpful as memTop
} from '$lib/adapters/notes.memory';

export const NotesFacade = {
  search: (q: string) => memSearch(q),
  detail: (id: string) => memById(id),
  helpful: (id: string) => memHelpful(id),
  topHelpful: (limit?: number) => memTop(limit ?? 5)
};