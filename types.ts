export interface Note {
  id: string;
  title: string;
  content: string; // HTML content from rich text editor
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  tags: string[];
  isPinned?: boolean;
}

export interface NoteFormData {
  title: string;
  content: string;
}

export interface StorageResult {
  notes: Note[];
  error?: string;
}