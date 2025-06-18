import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      // Login action - stores user data and token
      login: (userData) => set({
        user: userData,
        isAuthenticated: true
      }),
      
      // Logout action - clears user data
      logout: () => set({
        user: null,
        isAuthenticated: false
      }),
      
      // Update user information if needed
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      }))
    }),
    {
      name: 'booardmate-auth-storage', // name of the item in localStorage
      getStorage: () => localStorage, // storage method (default is localStorage)
    }
  )
);

export default useAuthStore;