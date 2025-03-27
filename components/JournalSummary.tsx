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
  const [selectedPeriod, setSelectedPeriod] = useState<string>('365');

  // Filter entries based on the selected period
  const now = new Date();
  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    const daysDifference = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDifference <= parseInt(selectedPeriod, 10);
  });

  // Map entries to heatmap data
  const heatmapData = filteredEntries.map((entry) => ({
    date: new Date(entry.date).toISOString().split('T')[0],
    count: 1,
  }));

  // Calculate category distribution
  const categoryCounts = filteredEntries.reduce((acc: Record<string, number>, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Category Distribution',
        data: Object.values(categoryCounts),
        backgroundColor: ['#c6e48b', '#7bc96f', '#239a3b', '#196127'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full h-auto overflow-y-auto">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Journal Summary</h2>

      {/* Period Selector */}
      <div className="mb-6">
        <label htmlFor="period" className="text-lg font-medium text-gray-700 mr-4">
          Select Period:
        </label>
        <select
          id="period"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      {/* Heatmap for showing days with entries */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Writing Consistency</h3>
        <CalendarHeatmap
          startDate={new Date(new Date().setDate(now.getDate() - parseInt(selectedPeriod, 10)))}
          endDate={now}
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

      {/* Category Distribution Bar Graph */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Category Distribution</h3>
        <Bar data={categoryData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>
    </div>
  );
}