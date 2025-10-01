"use client";
import { create } from "zustand";
import { subscribeAuth, signOut as doSignOut, profile } from "@/lib/auth";
import type { User } from "firebase/auth";

type S = {
  user: User | null;
  verified: boolean;
  initializing: boolean;
  signOut: () => Promise<void>;
};
export const useAuth = create<S>((set, get) => {
  // Initialize with dev mode if in development
  const isDev = process.env.NODE_ENV === "development";
  
  if (typeof window !== "undefined") {
    if (isDev) {
      // DEVELOPMENT MODE - Mock user for testing
      console.log("🚀 DEV MODE: Using mock user for testing");
      const mockUser = {
        uid: "dev-user-123",
        email: "dev@skatehubba.com",
        emailVerified: true,
        displayName: "Dev User"
      } as User;
      
      // Set verified cookie for middleware
      document.cookie = `hubba_verified=1; path=/`;
      
      // Set mock user after a brief delay to simulate auth loading
      setTimeout(() => {
        set({ user: mockUser, verified: true, initializing: false });
      }, 100);
    } else {
      // Original auth subscription (for production)
      subscribeAuth(async (u) => {
        if (!u) return set({ user: null, verified: false, initializing: false });
        const p = await profile(u.uid).catch(() => null);
        const emailVerified = !!u.emailVerified;
        // Write a cookie for middleware gating
        document.cookie = `hubba_verified=${emailVerified ? "1" : "0"}; path=/`;
        set({ user: u, verified: emailVerified, initializing: false });
      });
    }
  }
  return {
    user: null,
    verified: false,
    initializing: true,
    signOut: async () => {
      await doSignOut();
      document.cookie = "hubba_verified=0; path=/";
      set({ user: null, verified: false });
    }
  };
});
export function useUser() { return useAuth(s => s.user); }