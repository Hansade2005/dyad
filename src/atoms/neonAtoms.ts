import { atom } from "jotai";

export const neonApiKeyAtom = atom<string | null>(null);
export const neonProjectsAtom = atom<any[]>([]);
export const neonSelectedProjectAtom = atom<string | null>(null);
export const neonLoadingAtom = atom<boolean>(false);
export const neonErrorAtom = atom<string | null>(null);
