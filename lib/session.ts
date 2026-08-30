"use client";

// LocalStorage Keys for Member Profile (if needed)
const USER_PROFILE_KEY = "tequio_user_profile";

export interface UserProfile {
  nombre: string;
  email: string;
  rol?: string;
  savedAt?: string;
}

// 1. Get saved user profile from localStorage
export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Could not read tequio_user_profile from localStorage:", err);
    return null;
  }
}

// 2. Save user profile to localStorage
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    const data = {
      ...profile,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("Could not save tequio_user_profile to localStorage:", err);
  }
}

// 3. Clear profile
export function clearUserProfile(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_PROFILE_KEY);
  } catch (err) {
    console.warn("Could not remove tequio_user_profile:", err);
  }
}
