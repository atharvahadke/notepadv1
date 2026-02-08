import { Note } from '../types';

export const initialNotes: Note[] = [
  {
    "id": "1",
    "title": "Welcome to Lumina Notes",
    "content": "<h1>Welcome!</h1><p>This is a <strong>modern</strong>, static notes application designed with focus and aesthetics in mind.</p><p><br></p><h3>Features:</h3><ul><li>Glassmorphism UI</li><li>Rich Text Editing</li><li>Local Persistence</li><li>Fast Search</li></ul><p><br></p><p>Try editing this note or create a new one!</p>",
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z",
    "tags": ["welcome", "info"]
  },
  {
    "id": "2",
    "title": "Project Ideas",
    "content": "<p>Here are some cool ideas to work on:</p><ol><li>A weather app using WebGL</li><li><strong>AI-powered</strong> task manager</li><li>Personal finance dashboard</li></ol>",
    "createdAt": "2023-10-28T14:30:00.000Z",
    "updatedAt": "2023-10-28T15:00:00.000Z",
    "tags": ["ideas", "dev"]
  },
  {
    "id": "3",
    "title": "Meeting Notes: Design Sync",
    "content": "<p><strong>Attendees:</strong> Sarah, Mike, Alex</p><p><strong>Date:</strong> Oct 29, 2023</p><p><br></p><h3>Key Decisions:</h3><ul><li>Adopt the new color palette</li><li>Switch to <em>Inter</em> font family</li><li>Increase border radius on cards</li></ul>",
    "createdAt": "2023-10-29T09:15:00.000Z",
    "updatedAt": "2023-10-29T10:00:00.000Z",
    "tags": ["work", "meeting"]
  }
];