import type { PageServerLoad } from './$types';
import { NotesFacade } from '$lib/facade/notes';

export const load: PageServerLoad = async ({ url }) => {
  const q = url.searchParams.get('q')?.trim() ?? '';
  const results = q ? await NotesFacade.search(q) : [];
  return { q, results };
};