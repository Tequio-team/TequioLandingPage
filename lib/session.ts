"use client";

// LocalStorage Keys
const USER_PROFILE_KEY = "tequio_user_profile";
const REGISTERED_EVENTS_KEY = "tequio_registered_events";

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

// 3. Save event registration ID to localStorage
export function saveEventRegistration(eventId: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getRegisteredEvents();
    if (!existing.includes(eventId)) {
      existing.push(eventId);
      localStorage.setItem(REGISTERED_EVENTS_KEY, JSON.stringify(existing));
    }
  } catch (err) {
    console.warn("Could not save tequio_registered_events to localStorage:", err);
  }
}

// 4. Get list of registered event IDs
export function getRegisteredEvents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Could not read tequio_registered_events from localStorage:", err);
    return [];
  }
}

// 5. Check if user is registered for a specific event
export function isRegisteredForEvent(eventId: string): boolean {
  const registeredList = getRegisteredEvents();
  return registeredList.includes(eventId);
}
