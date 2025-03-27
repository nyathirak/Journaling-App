import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
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

export default function Summary({ initialEntries }: JournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [filter, setFilter] = useState<string>("");

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

      {/* Main Content */}
      <main className="flex-1 p-10">
        {/* Pass entries to JournalSummary */}
        <JournalSummary entries={entries} />
      </main>
    </div>
  );
}