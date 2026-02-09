import { Note } from '../types';
import { initialNotes } from '../data/initialData';

const STORAGE_KEY = 'lumina_notes_data_v1';
const SESSION_UNLOCK_KEY = 'lumina_session_unlocked';
const DEFAULT_PASSWORD = '2301';

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
 * Resets the application to its factory state by clearing local storage
 * and reloading the page to fetch initialData from code.
 */
export const hardReset = () => {
  if (window.confirm("FACTORY RESET: All local changes will be deleted and default data restored. This cannot be undone. Proceed?")) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
};

/**
 * Downloads both notes.json and a reconstructed initialData.ts
 */
export const exportData = (notes: Note[]) => {
  const jsonContent = JSON.stringify(notes, null, 2);
  
  // 1. Download notes.json
  downloadFile(jsonContent, 'notes.json', 'application/json');

  // 2. Download initialData.ts (formatted as source code)
  // We reconstruct the file content to match the structure of data/initialData.ts
  const tsContent = `import { Note } from '../types';\n\nexport const initialNotes: Note[] = ${jsonContent};\n`;
  
  // Use a small timeout to prevent browser blocking the second download
  setTimeout(() => {
    downloadFile(tsContent, 'initialData.ts', 'text/plain');
  }, 500);
};

const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// --- App Lock Services ---

export const verifyPassword = (input: string): boolean => {
  return input === DEFAULT_PASSWORD;
};

// --- Session Management ---

export const setAppUnlocked = () => {
  sessionStorage.setItem(SESSION_UNLOCK_KEY, 'true');
};

export const isAppUnlocked = (): boolean => {
  return sessionStorage.getItem(SESSION_UNLOCK_KEY) === 'true';
};

export const lockAppSession = () => {
  sessionStorage.removeItem(SESSION_UNLOCK_KEY);
}
