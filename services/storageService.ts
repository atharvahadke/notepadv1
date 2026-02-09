import { Note } from '../types';
import { initialNotes } from '../data/initialData';

const STORAGE_KEY = 'lumina_notes_data_v1';
const SESSION_UNLOCK_KEY = 'lumina_session_unlocked';
const DEFAULT_PASSWORD = '2301';

// Fallback data in case import fails or data is corrupted
const FALLBACK_NOTES: Note[] = [
  {
    "id": "1",
    "title": "Welcome to Lumina Notes",
    "content": "<h1>Welcome!</h1><p>This is a <strong>modern</strong>, static notes application designed with focus and aesthetics in mind.</p><p><br></p><h3>Features:</h3><ul><li>Glassmorphism UI</li><li>Rich Text Editing</li><li>Local Persistence</li><li>Fast Search</li></ul><p><br></p><p>Try editing this note or create a new one!</p>",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "tags": ["welcome", "info"]
  }
];

/**
 * Loads notes from LocalStorage if available, otherwise falls back to the static data.
 * This simulates a "load" from the file system on first run.
 */
export const loadNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    
    // If no local storage data, return the static initial data.
    // We add a check to ensure initialNotes is valid.
    const notes = (initialNotes && Array.isArray(initialNotes)) ? initialNotes : FALLBACK_NOTES;
    
    // Save to local storage immediately so subsequent edits are saved
    saveNotes(notes);
    return notes;
  } catch (error) {
    console.error("Failed to load notes", error);
    return FALLBACK_NOTES;
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
