import React, { useState } from 'react';
import { Note } from '../types';
import NoteCard from './NoteCard';
import { Search, Plus, Download, Lock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
  onPinNote: (id: string) => void;
  onDownload: () => void;
  onLockApp: () => void;
  hasPassword: boolean;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  notes, 
  activeNoteId, 
  onSelectNote, 
  onCreateNote, 
  onDeleteNote,
  onPinNote,
  onDownload,
  onLockApp,
  isOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Sort by pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by updated date descending
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 w-80 
        bg-black/60 backdrop-blur-xl border-r border-white/5
        transform transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col h-full
        shadow-[5px_0_30px_rgba(0,0,0,0.5)]
      `}
    >
      {/* Ambient glow effect at top left */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#bd00ff]/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pb-4 relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-black/40 rounded-xl border border-[#00f3ff]/30 shadow-[0_0_15px_rgba(0,243,255,0.15)] backdrop-blur-sm group hover:border-[#00f3ff]/60 transition-colors">
            <Zap size={20} className="text-[#00f3ff] drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00f3ff] to-[#bd00ff]">
            Lumina
          </h1>
        </div>

        <button
          onClick={onCreateNote}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[#00f3ff]/10 to-[#bd00ff]/10 border border-[#00f3ff]/20 hover:border-[#00f3ff]/50 text-white rounded-xl shadow-[0_0_15px_-5px_rgba(0,243,255,0.1)] hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 font-bold mb-6 group relative overflow-hidden backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00f3ff]/20 to-[#bd00ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Plus size={18} className="text-[#00f3ff] group-hover:rotate-90 transition-transform duration-500 drop-shadow-[0_0_2px_#00f3ff]" />
          <span className="relative z-10 tracking-wide text-sm">CREATE NOTE</span>
        </button>

        {/* Search */}
        <div className="relative group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-[#00f3ff] transition-colors duration-300" />
          <input 
            type="text" 
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/5 group-hover:border-white/10 focus:border-[#00f3ff]/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#00f3ff]/30 transition-all placeholder:text-neutral-600 shadow-inner"
          />
        </div>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 mt-2 space-y-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                isActive={activeNoteId === note.id}
                onClick={() => onSelectNote(note.id)}
                onDelete={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                onPin={(e) => {
                  e.stopPropagation();
                  onPinNote(note.id);
                }}
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-block p-4 rounded-full bg-white/5 mb-3 text-neutral-600 border border-dashed border-neutral-800">
                <Search size={24} />
              </div>
              <p className="text-neutral-500 text-sm font-medium">No notes found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 bg-black/40 flex gap-2 backdrop-blur-md relative z-10">
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium text-neutral-500 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
          title="Export JSON"
        >
          <Download size={14} />
          Export
        </button>
        <button
          onClick={onLockApp}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all border border-transparent hover:border-white/5 text-[#00f3ff]/80 hover:text-[#00f3ff] hover:bg-[#00f3ff]/5"
          title="Lock App"
        >
          <Lock size={14} />
          Lock
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
