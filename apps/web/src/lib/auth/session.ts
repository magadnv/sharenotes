import { writable } from 'svelte/store';

export type SessionShape = { userId?: string; email?: string } | null;
export const sessionStore = writable<SessionShape>(null);