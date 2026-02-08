import React, { useEffect, useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import { Note } from '../types';
import { Calendar, Clock, Tag, Save, Maximize2, Minimize2, Type, AlignLeft } from 'lucide-react';
import { format } from 'date-fns';

// Register Fonts
const Quill = ReactQuill.Quill;
if (Quill) {
  const Font = Quill.import('formats/font');
  // We include 'false' for the default font (Plus Jakarta Sans/Inter defined in CSS)
  Font.whitelist = [
    'roboto', 
    'playfair', 
    'oswald', 
    'courier-prime'
  ];
  Quill.register(Font, true);
}

interface EditorProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
}

const Editor: React.FC<EditorProps> = ({ note, onUpdate, isFocusMode, toggleFocusMode }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags.join(', '));
  const [isSaving, setIsSaving] = useState(false);

  // Stats calculation
  const stats = useMemo(() => {
    const text = content.replace(/<[^>]+>/g, ' ');
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return { wordCount, readTime };
  }, [content]);

  // Sync internal state when prop changes (e.g. switching notes)
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(', '));
  }, [note.id]);

  // Debounced save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content || tags !== note.tags.join(', ')) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content, tags]);

  const handleSave = () => {
    setIsSaving(true);
    const updatedNote: Note = {
      ...note,
      title,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      updatedAt: new Date().toISOString()
    };
    onUpdate(updatedNote);
    setTimeout(() => setIsSaving(false), 500);
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'font': [false, 'roboto', 'playfair', 'oswald', 'courier-prime'] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  return (
    <div className="flex flex-col h-full bg-[#050505] overflow-hidden relative">
      {/* Background neon glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#bd00ff]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Controls */}
      <div className="absolute top-6 right-8 z-20 flex gap-2">
         <button 
           onClick={toggleFocusMode}
           className="p-2.5 bg-black/40 hover:bg-[#00f3ff]/10 border border-white/10 hover:border-[#00f3ff]/50 rounded-xl text-neutral-400 hover:text-[#00f3ff] transition-all backdrop-blur-sm shadow-[0_0_10px_rgba(0,0,0,0.5)]"
           title={isFocusMode ? "Exit Focus Mode" : "Focus Mode"}
         >
           {isFocusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
         </button>
      </div>

      {/* Editor Header */}
      <div className="px-10 py-8 border-b border-white/5 bg-gradient-to-b from-black/90 to-black/0 sticky top-0 z-10 backdrop-blur-md">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note"
          className="w-full bg-transparent text-4xl font-bold text-white placeholder-neutral-700 focus:outline-none mb-6 pr-16 border-l-4 border-transparent focus:border-[#00f3ff] pl-0 focus:pl-4 transition-all duration-300"
        />
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-medium">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 hover:border-[#bd00ff]/30 transition-colors">
            <Calendar size={12} className="text-[#bd00ff]" />
            <span>{format(new Date(note.createdAt), 'MMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 hover:border-[#ff00ff]/30 transition-colors">
            <Type size={12} className="text-[#ff00ff]" />
            <span>{stats.wordCount} words</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 flex-1 min-w-[200px] hover:border-[#00f3ff]/30 transition-colors focus-within:border-[#00f3ff]/50 focus-within:shadow-[0_0_10px_rgba(0,243,255,0.1)]">
            <Tag size={12} className="text-[#00f3ff]" />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags..."
              className="bg-transparent text-neutral-300 focus:outline-none w-full placeholder-neutral-600"
            />
          </div>

          <div className={`flex items-center gap-2 text-[#00ff9d] transition-all duration-500 ${isSaving ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] shadow-[0_0_5px_#00ff9d] animate-pulse"></div>
            <span className="drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]">Saved</span>
          </div>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="flex-1 overflow-y-auto relative custom-quill-wrapper">
        <ReactQuill 
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="Start writing..."
          className="h-full"
        />
      </div>
    </div>
  );
};

export default Editor;
