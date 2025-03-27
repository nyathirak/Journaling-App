// Interface defining the structure of a journal entry
interface JournalEntry {
  id: string;
  userId: number;
  title: string;
  content: string;
  category: string;
  date: string;
}

// Props interface for the JournalList component
interface JournalListProps {
  entries: JournalEntry[];
  filter: string;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export default function JournalList({
  entries,
  filter,
  onEdit,
  onDelete,
}: JournalListProps) {
  // Filter the entries based on the selected category
  const filteredEntries = Array.isArray(entries)
    ? filter
      ? entries.filter((entry) => entry.category === filter)
      : entries
    : [];

  // Styles for classes for a category badge
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      personal: "bg-purple-100 text-purple-800",
      work: "bg-pink-100 text-pink-800",
      ideas: "bg-green-100 text-green-800",
      goals: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-white text-black";
  };

  return (
   <div className="space-y-6 max-h-[500px] overscroll-y-auto overflow-y-scroll scrollbar-hide">
      {/* Display a message if there are no filtered entries */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-8 text-red-500 text-md font-semibold">
          No entries yet. Start writing!
        </div>
      ) : (
        // Get the filtered entries and render each one
        filteredEntries.map((entry: JournalEntry, index: number) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition border-pink-200 duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-black">{entry.title}</h3>
              <span className="text-sm text-black">
                {new Date(entry.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getCategoryColor(
                entry.category
              )}`}
            >
              {entry.category}
            </div>
            {/* Action buttons for editing and deleting the entry */}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => onEdit(entry)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
