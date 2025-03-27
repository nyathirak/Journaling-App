import { useState } from "react";
import Sidebar from "../components/Sidebar";
import JournalSummary from "../components/JournalSummary";
import { useSession } from "next-auth/react";

// Interface defining the structure of a journal entry
interface JournalEntry {
  id: string;
  userId: number;
  title: string;
  content: string;
  category: string;
  date: string;
}

interface JournalProps {
  initialEntries: JournalEntry[];
}

export default function Summary({ initialEntries }: JournalProps) {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl text-black font-semibold mb-6">Summary</h2>
        {/* Pass entries to JournalSummary */}
        <JournalSummary entries={entries} />
      </main>
    </div>
  );
}
