import React from 'react';
import { motion } from 'framer-motion';
import { Note } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, Star } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onPin: (e: React.MouseEvent) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, isActive, onClick, onDelete, onPin }) => {
  // Strip HTML for preview
  const previewText = note.content.replace(/<[^>]+>/g, '').slice(0, 75) + (note.content.length > 75 ? '...' : '');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        group relative w-full p-4 mb-3 rounded-xl cursor-pointer transition-all duration-300 border
        ${isActive 
          ? 'bg-gradient-to-br from-neon-cyan/10 to-neon-purple/5 border-neon-cyan/50 shadow-[0_0_20px_-5px_rgba(0,243,255,0.15)]' 
          : 'bg-white/5 border-transparent hover:border-white/10 hover:shadow-lg'
        }
      `}
    >
      {isActive && (
        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]"></div>
      )}
      
      <div className="flex justify-between items-start mb-2 pl-2">
        <h3 className={`font-semibold text-sm truncate pr-4 flex items-center gap-2 ${isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white transition-colors'}`}>
          {note.isPinned && <Star size={12} className="fill-neon-pink text-neon-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]" />}
          {note.title || <span className="italic opacity-50">Untitled Note</span>}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button
            onClick={onPin}
            className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${note.isPinned ? 'text-neon-pink' : 'text-neutral-500 hover:text-neon-pink'}`}
            title={note.isPinned ? "Unpin Note" : "Pin Note"}
          >
            <Star size={13} className={note.isPinned ? "fill-current" : ""} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-500/20 rounded-lg text-neutral-500 hover:text-red-400 transition-colors"
            title="Delete Note"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      
      <p className={`text-xs mb-3 h-8 overflow-hidden leading-relaxed transition-colors pl-2 ${isActive ? 'text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-400'}`}>
        {previewText || <span className="opacity-30">No content</span>}
      </p>

      <div className="flex items-center justify-between pl-2">
        <span className="text-[10px] text-neutral-600 font-medium group-hover:text-neutral-500">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
        {note.tags.length > 0 && (
          <div className="flex gap-1">
            {note.tags.slice(0, 2).map(tag => (
              <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-md border ${isActive ? 'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan' : 'bg-black/30 border-white/5 text-neutral-500'}`}>
                #{tag}
              </span>
            ))}
            {note.tags.length > 2 && (
              <span className="text-[10px] px-1 text-neutral-600">+{note.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NoteCard;
