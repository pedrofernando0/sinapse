import { create } from 'zustand';
import { createSessionSlice } from './sessionSlice.js';
import { createUiSlice } from './uiSlice.js';

export const useAppStore = create((...args) => ({
  ...createSessionSlice(...args),
  ...createUiSlice(...args),
}));

export function StoreBootstrap() {
  useAppStore((state) => state.profile);
  return null;
}
