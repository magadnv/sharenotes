export type NoteSummary = {
  id: string;
  title: string;
  excerpt: string;
  subject: string;
  helpful: number;
  created_at?: string;
};

export type NoteDetail = NoteSummary & {
  content: string;
};