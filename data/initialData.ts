import { Note } from '../types';

export const initialNotes: Note[] = [
  {
    "id": "1",
    "title": "txt",
    "content": "txt",
    "createdAt": "",
    "updatedAt": "",
    "tags": [""]
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
