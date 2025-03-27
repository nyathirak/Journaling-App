import { useState, useEffect } from 'react';
import JournalForm from '../components/JournalForm';
import JournalList from '../components/JournalList';
import { signOut } from "next-auth/react";
import Swal from 'sweetalert2';

interface JournalEntry {
  id: string;
  userId: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

interface JournalProps {
  initialEntries: JournalEntry[];
}

export default function Journal({ initialEntries }: JournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [filter, setFilter] = useState<string>('');
  const [entryToEdit, setEntryToEdit] = useState<JournalEntry | null>(null);

  const handleNewEntry = async (entry: JournalEntry) => {
    try {
      const res = await fetch("/api/auth/journal", {
        method: entry.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const responseData = await res.json();

      if (!res.ok) {
        console.error("Error from API:", responseData);
        return;
      }

      if (entry.id) {
        setEntries(entries.map(e => e.id === entry.id ? responseData : e));
        Swal.fire("Updated!", "Your journal entry has been updated!", "success");
      } else {
        setEntries([...entries, responseData]);
        Swal.fire("Success!", "Your journal entry has been saved!", "success");
      }

      setEntryToEdit(null);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEntryToEdit(entry);
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const res = await fetch("/api/auth/journal", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const responseData = await res.json();
        console.error("Error from API:", responseData);
        return;
      }

      setEntries(entries.filter(entry => entry.id !== id));
      Swal.fire("Deleted!", "Your journal entry has been deleted!", "success");
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await fetch('/api/auth/journal');
        const data = await res.json();
        setEntries(data);
      } catch (error) {
        console.error('Error fetching journals:', error);
      }
    };

    fetchJournals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-indigo-100 flex flex-col items-center py-12">
      <main className="w-full max-w-6xl px-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">My Journal</h1>
          <button 
            onClick={() => signOut({ callbackUrl: "/" })} 
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 transition text-white font-semibold rounded-lg shadow-lg"
          >
            Logout
          </button>
        </div>
    
        {/* Content Grid*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* New Entry Form*/}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full h-[500px]">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">{entryToEdit ? 'Edit Entry' : 'New Entry'}</h2>
            <JournalForm onSubmit={handleNewEntry} entryToEdit={entryToEdit} />
          </div>
    
          {/* Entries List*/}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full h-[500px] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-900">My Entries</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="ideas">Ideas</option>
                <option value="goals">Goals</option>
              </select>
            </div>
            <JournalList entries={entries} filter={filter} onEdit={handleEditEntry} onDelete={handleDeleteEntry} />
          </div>
        </div>
      </main>
    </div>
  );
}