import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';

const STORAGE_KEY = 'devplay-progress';

function loadProgress(): Record<string, boolean> {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return {};
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, boolean>;
    }
  } catch {
    return {};
  }
  return {};
}

function saveProgress(progress: Record<string, boolean>): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    return;
  }
}

export const progressStore = atom<Record<string, boolean>>(loadProgress());

export function markConceptCompleted(slug: string): void {
  if (!slug) {
    return;
  }
  const current = progressStore.get();
  if (current[slug]) {
    return;
  }
  const updated = { ...current, [slug]: true };
  progressStore.set(updated);
  saveProgress(updated);
}

export function useCompletedConcepts(): Record<string, boolean> {
  return useStore(progressStore);
}

export function getCurrentConceptSlug(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  const segments = window.location.pathname.replace(/\/+$/, '').split('/');
  return segments[segments.length - 1] ?? '';
}
