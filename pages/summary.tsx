import { useState } from "react";
import Sidebar from "../components/Sidebar";
import JournalSummary from "../components/JournalSummary";
import { useSession } from "next-auth/react";

// Interface defining the structure of a journal entry
interface JournalSummary {
  id: string;
  userId: number;
  title: string;
  content: string;
  category: string;
  date: string;
}

interface JournalSummaryProps {
  entries: JournalSummary[];
}

export default function Summary({ entries }: JournalSummaryProps) {
  const { data: session } = useSession();
  // const [entries, setEntries] = useState<JournalEntry[]>(entries);

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
