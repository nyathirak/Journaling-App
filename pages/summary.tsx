import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import JournalSummary from "../components/JournalSummary";

export default function SummaryPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Fetch entries (replace this with actual data fetching logic)
    async function fetchEntries() {
      try {
        const response = await fetch("/api/auth/journal"); // Adjust API endpoint
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    }

    fetchEntries();
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-10">
        <JournalSummary entries={entries} />
      </main>
    </div>
  );
}
