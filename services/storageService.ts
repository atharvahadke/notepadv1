import { Note } from '../types';
import { initialNotes } from '../data/initialData';

const STORAGE_KEY = 'lumina_notes_data_v1';
const LOCK_KEY = 'lumina_app_lock_pwd';
const SESSION_UNLOCK_KEY = 'lumina_session_unlocked';

/**
 * Loads notes from LocalStorage if available, otherwise falls back to the static data.
 * This simulates a "load" from the file system on first run.
 */
export const loadNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // If no local storage data, return the static initial data
    const notes = initialNotes;
    // Save to local storage immediately so subsequent edits are saved
    saveNotes(notes);
    return notes;
  } catch (error) {
    console.error("Failed to load notes", error);
    return [];
  }
};

/**
 * Saves the current state of notes to LocalStorage.
 * In a real node app, this would write to the file system.
 */
export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Failed to save notes", error);
  }
};

/**
 * Utility to download the current notes as a JSON file.
 * Allows the user to manually "save" the file since we can't write to disk.
 */
export const downloadNotesJSON = (notes: Note[]) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "notes.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

// --- App Lock Services ---

export const getStoredPassword = (): string | null => {
  return localStorage.getItem(LOCK_KEY);
};

export const setStoredPassword = (password: string): void => {
  localStorage.setItem(LOCK_KEY, password); // In a real app, hash this!
};

export const removeStoredPassword = (): void => {
  localStorage.removeItem(LOCK_KEY);
};

export const verifyPassword = (input: string): boolean => {
  const stored = getStoredPassword();
  return stored === input;
};

// --- Session Management ---

export const setAppUnlocked = () => {
  sessionStorage.setItem(SESSION_UNLOCK_KEY, 'true');
};

export const isAppUnlocked = (): boolean => {
  return sessionStorage.getItem(SESSION_UNLOCK_KEY) === 'true';
};
