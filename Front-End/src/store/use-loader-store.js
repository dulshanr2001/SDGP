import { create } from 'zustand';

export const useLoaderStore = create((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));