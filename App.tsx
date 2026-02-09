import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { loadNotes, saveNotes, downloadNotesJSON } from './services/storageService';
import { Note } from './types';
import { Menu } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Focus Mode
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Initialize data
  useEffect(() => {
    // Load Notes from JSON (static file)
    const loadedNotes = loadNotes();
    setNotes(loadedNotes);
    if (loadedNotes.length > 0) {
      setActiveNoteId(loadedNotes[0].id);
    }
    setIsLoaded(true);
  }, []);

  // Update in-memory storage (optional consistency check, though saveNotes is now no-op)
  useEffect(() => {
    if (isLoaded) {
      saveNotes(notes);
    }
  }, [notes, isLoaded]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: '',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      isPinned: false
    };
    
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    // On mobile, close sidebar when creating new note
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const newNotes = notes.filter(n => n.id !== id);
      setNotes(newNotes);
      if (activeNoteId === id) {
        setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null);
      }
    }
  };

  const handlePinNote = (id: string) => {
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    ));
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const getActiveNote = () => notes.find(n => n.id === activeNoteId);

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden font-sans">
      
      {/* Mobile Menu Button */}
      <button 
        className={`md:hidden fixed top-4 left-4 z-50 p-2 bg-neutral-900 rounded-lg text-white shadow-lg border border-neutral-800 ${isFocusMode ? 'hidden' : ''}`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden in Focus Mode */}
      {!isFocusMode && (
        <div className="h-full flex-shrink-0">
          <Sidebar
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={(id) => {
              setActiveNoteId(id);
              setIsSidebarOpen(false);
            }}
            onCreateNote={handleCreateNote}
            onDeleteNote={handleDeleteNote}
            onPinNote={handlePinNote}
            onDownload={() => downloadNotesJSON(notes)}
            isOpen={isSidebarOpen}
          />
        </div>
      )}

      <main className="flex-1 h-full relative z-0 bg-black min-w-0">
        {activeNoteId && getActiveNote() ? (
          <Editor 
            note={getActiveNote()!} 
            onUpdate={handleUpdateNote} 
            isFocusMode={isFocusMode}
            toggleFocusMode={() => setIsFocusMode(!isFocusMode)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-600 p-8 text-center opacity-50">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-neutral-900 flex items-center justify-center border border-neutral-800">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-lg font-medium">Select a note or create a new one</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
