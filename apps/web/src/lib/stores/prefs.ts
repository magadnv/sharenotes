import { writable } from 'svelte/store';

const KEY = 'sn:showTopHelpful';

function createPref() {
  const initial = typeof localStorage !== 'undefined'
    ? localStorage.getItem(KEY) === 'true'
    : false;

  const { subscribe, set, update } = writable<boolean>(initial);

  // persist
  subscribe((v) => {
    try { localStorage.setItem(KEY, String(v)); } catch {}
  });

  return { subscribe, set, toggle: () => update(v => !v) };
}

export const showTopHelpful = createPref();