import type { NoteSummary, NoteDetail } from '$lib/types/notes';

const DATA: NoteDetail[] = [
  {
    id: '1',
    title: 'Dijkstra – Kurz & Klar',
    excerpt: 'Algorithmus-Schritte, Pseudocode und Prüfungsfallen.',
    subject: 'Algorithmen',
    helpful: 5,
    created_at: '2025-09-10T12:00:00Z',
    content: 'Dijkstra findet kürzeste Pfade in Graphen mit nicht-negativen Kantenkosten...'
  },
  {
    id: '2',
    title: 'Photosynthese – Essenz',
    excerpt: 'Licht- vs. Dunkelreaktion kompakt.',
    subject: 'Biologie',
    helpful: 3,
    created_at: '2025-09-09T12:00:00Z',
    content: 'Lichtreaktion: ATP/NADPH; Calvin-Zyklus: CO2-Fixierung...'
  }
];

export async function searchNotes(q: string): Promise<NoteSummary[]> {
  if (!q?.trim()) return [];
  const s = q.toLowerCase();
  return DATA
    .filter(n => n.title.toLowerCase().includes(s) || n.subject.toLowerCase().includes(s))
    .map(({ content, ...summary }) => summary)
    .sort((a, b) => b.helpful - a.helpful);
}

export async function getNoteById(id: string): Promise<NoteDetail | null> {
  return DATA.find(n => n.id === id) ?? null;
}

export async function markHelpful(_id: string): Promise<boolean> {
  // Stub: hier nichts verändern, nur Erfolg simulieren
  return true;
}

export async function getTopHelpful(limit = 5): Promise<NoteSummary[]> {
  return [...DATA]
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, limit)
    .map(({ content, ...summary }) => summary);
}