import { atom } from "jotai";

export const vercelProjectsAtom = atom<any[]>([]);
export const vercelLoadingAtom = atom<boolean>(false);
export const vercelErrorAtom = atom<Error | null>(null);
export const selectedVercelProjectAtom = atom<string | null>(null);
