import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";
import JournalForm from "../components/JournalForm";
import JournalList from "../components/JournalList";
import JournalSummary from "../components/JournalSummary";

// Interface defining the structure of a journal entry
interface JournalEntry {
  id: string;
  userId: number;
  title: string;
  content: string;
  category: string;
  date: string;
}

// Props interface for the Journal page
interface JournalProps {
  initialEntries: JournalEntry[];
}

export default function Journal({ initialEntries }: JournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [filter, setFilter] = useState<string>("");
  const [entryToEdit, setEntryToEdit] = useState<JournalEntry | null>(null);

  // Handle adding or updating a journal entry
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
        setEntries(entries.map((e) => (e.id === entry.id ? responseData : e)));
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

  // Handle deleting a journal entry
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

      setEntries(entries.filter((entry) => entry.id !== id));
      Swal.fire("Deleted!", "Your journal entry has been deleted!", "success");
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Fetch journal entries
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await fetch("/api/auth/journal");
        const data = await res.json();
        setEntries(data);
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    };

    fetchJournals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-indigo-100 flex flex-col items-center py-12">
      <main className="w-full max-w-7xl px-6">
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* New Entry Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full h-[600px]">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              {entryToEdit ? "Edit Entry" : "New Entry"}
            </h2>
            <JournalForm onSubmit={handleNewEntry} entryToEdit={entryToEdit} />
          </div>

          {/* Entries List */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full h-[600px] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-900">
                My Entries
              </h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)} // Update filter state
                className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="ideas">Ideas</option>
                <option value="goals">Goals</option>
              </select>
            </div>
            <JournalList
              entries={entries} // Pass filtered entries
              filter={filter}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          </div>
        </div>

        {/* Journal Summary */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full">
          <JournalSummary entries={entries} />
        </div>
      </main>
    </div>
  );
}