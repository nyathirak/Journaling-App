import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";
import JournalForm from "../components/JournalForm";
import JournalList from "../components/JournalList";
import { useSession } from "next-auth/react";
import Sidebar from "../components/Sidebar";

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
  const { data: session } = useSession();
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
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      <main className="flex-1 p-10">
        <h2 className="text-3xl text-black font-semibold mb-6"> 
          {entryToEdit ? "Edit Entry" : "New Entry"}
        </h2>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
          {/* New Entry Form */}
          <div className="bg-white w-full text-black">
            <JournalForm onSubmit={handleNewEntry} entryToEdit={entryToEdit} />
          </div>

          {/* Entries List */}
          <div className="bg-white w-full text-black">
            <div className="flex justify-between items-center mb-4 focus:ring-2 focus:ring-pink-500 focus:outline-none">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white w-full h-full">
                <option value="">All Categories</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="ideas">Ideas</option>
                <option value="goals">Goals</option>
              </select>
            </div>
            <JournalList
              entries={entries}
              filter={filter}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          </div>
        </div>
      </main>
</div>

  );
}