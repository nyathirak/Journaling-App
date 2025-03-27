import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Interface defining the structure of a journal entry
interface JournalEntry {
  id: string; 
  userId: number;
  title: string; 
  content: string;
  category: string;
  date: string;
}

// Props interface for the JournalForm component
interface JournalFormProps {
  onSubmit: (entry: JournalEntry) => void;
  entryToEdit?: JournalEntry | null;
}

export default function JournalForm({ onSubmit, entryToEdit }: JournalFormProps) {

  // Managing state entry being created or edited
  const [entry, setEntry] = useState<JournalEntry>({
    id: '',
    userId: 0,
    title: '',
    content: '',
    category: 'personal',
    date: '',
  });

  useEffect(() => {
    if (entryToEdit) {
      setEntry(entryToEdit);
    }
  }, [entryToEdit]);

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(entry);
    Swal.fire("Success!", "Your journal entry has been saved!", "success");
    setEntry({ ...entry, title: '', content: '', category: 'personal' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title input field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-black mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="What's on your mind?"
          value={entry.title}
          onChange={(e) => setEntry({ ...entry, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200"
          required
        />
      </div>

      {/* Category dropdown */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-black mb-1">
          Category
        </label>
        <select
          id="category"
          value={entry.category}
          onChange={(e) => setEntry({ ...entry, category: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:text-pink focus:ring-pink-500 transition duration-200"
        >
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="ideas">Ideas</option>
          <option value="goals">Goals</option>
        </select>
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-black mb-1">
          Your Thoughts
        </label>
        <textarea
          id="content"
          placeholder="Write your thoughts here..."
          value={entry.content}
          onChange={(e) => setEntry({ ...entry, content: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-200 h-40 resize-none"
          required
        />
      </div>
      {/* Dynamic Submit/Edit button */}
      <button
        type="submit"
        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-medium hover:from-pink-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transform transition duration-200 hover:scale-[1.02]"
      >
        {entryToEdit ? 'Update Entry' : 'Save Entry'}
      </button>
    </form>
  );
}