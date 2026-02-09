import { Note } from '../types';
import { initialNotes } from '../data/initialData';

// We no longer use localStorage for notes or locking.
// The app is ephemeral: loads from initialData on refresh,
// and updates are kept in memory only during the session.

/**
 * Loads notes from the static JSON file (initialData).
 * Always resets to initial state on reload.
 */
export const loadNotes = (): Note[] => {
  // Deep copy to prevent mutating the original import
  return JSON.parse(JSON.stringify(initialNotes));
};

/**
 * No-op: We do not persist updates to the browser storage.
 */
export const saveNotes = (notes: Note[]): void => {
  // Intentionally empty
};

/**
 * Utility to download the current notes as a JSON file.
 * This is the only way to "save" data in this configuration.
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
