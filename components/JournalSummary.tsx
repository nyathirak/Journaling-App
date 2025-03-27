import React, { useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { TooltipDataAttrs } from 'react-calendar-heatmap';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const [selectedPeriod, setSelectedPeriod] = useState<string>("365");

  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - parseInt(selectedPeriod, 10));

  // Filter entries within selected period
  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate <= now;
  });

  // Aggregate heatmap data (group by date)
  const heatmapData: Record<string, number> = {};
  filteredEntries.forEach((entry) => {
    const dateKey = entry.date.split("T")[0];
    heatmapData[dateKey] = (heatmapData[dateKey] || 0) + 1;
  });

  const heatmapValues = Object.keys(heatmapData).map((date) => ({
    date,
    count: heatmapData[date],
  }));

  // Category distribution
  const categoryCounts = filteredEntries.reduce((acc: Record<string, number>, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Category Distribution",
        data: Object.values(categoryCounts),
        backgroundColor: ["#c6e48b", "#7bc96f", "#239a3b", "#196127"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Period Selector */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-pink-800 mt-0">Writing Consistency</h3>
        <select
          id="period"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 text-black text-sm focus:ring-2 focus:ring-pink-500 rounded-md"
        >
          <option value="30">Last 30 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      {/* Heatmap */}
      <CalendarHeatmap
        startDate={startDate}
        endDate={now}
        values={heatmapValues}
        classForValue={(value) => {
          if (!value) return "color-empty";
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

      {/* Bar Chart */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Category Distribution</h3>
        <div className="w-full h-[300px]">
          <Bar
            data={categoryData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
      </div>
    </div>
  );
}
