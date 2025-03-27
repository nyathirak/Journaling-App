import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { TooltipDataAttrs } from 'react-calendar-heatmap';

interface JournalEntry {
  id: string;
  userId: number;
  title: string;
  content: string;
  category: string;
  date: string;
}

interface JournalSummaryProps {
  entries: JournalEntry[];
}

export default function JournalSummary({ entries = [] }: JournalSummaryProps) {
  const validEntries = Array.isArray(entries) ? entries : [];

  // Map entries to heatmap data
  const heatmapData = validEntries.map((entry) => ({
    date: new Date(entry.date).toISOString().split('T')[0],
    count: 1,
  }));

  console.log(heatmapData);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full h-auto overflow-y-auto">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Journal Summary</h2>

      {/* Heatmap for showing days with entries */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Writing Consistency</h3>
        <CalendarHeatmap
          startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
          endDate={new Date()}
          values={heatmapData}
          classForValue={(value) => {
            if (!value) return 'color-empty';
            return `color-scale-${Math.min(value.count, 4)}`;
          }}
          tooltipDataAttrs={(value): TooltipDataAttrs => {
            if (!value || !value.date) {
              return { 'data-tooltip': 'No entries' } as TooltipDataAttrs;
            }
            return { 'data-tooltip': `${value.date}: ${value.count} entry(ies)` } as unknown as TooltipDataAttrs;
          }}
          showWeekdayLabels
        />
      </div>
    </div>
  );
}