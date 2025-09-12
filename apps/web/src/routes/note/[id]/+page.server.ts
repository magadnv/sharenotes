import type { PageServerLoad } from './$types';
import { NotesFacade } from '$lib/facade/notes';

export const load: PageServerLoad = async ({ params }) => {
  const note = await NotesFacade.detail(params.id);
  return { note };
};