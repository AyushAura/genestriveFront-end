"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Presentational cards for stats
const StatsCards = ({ dailyActiveUsers, testsCreated, avgTimeSpent }) => (
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-lg p-8 shadow flex flex-col items-center">
      <div className="text-4xl font-bold text-blue-700">{dailyActiveUsers ?? '-'}</div>
      <div className="text-gray-600 mt-2">Daily Active Users</div>
    </div>
    <div className="bg-white rounded-lg p-8 shadow flex flex-col items-center">
      <div className="text-4xl font-bold text-green-700">{testsCreated ?? '-'}</div>
      <div className="text-gray-600 mt-2">Tests Created Today</div>
    </div>
    <div className="bg-white rounded-lg p-8 shadow flex flex-col items-center">
      <div className="text-4xl font-bold text-purple-700">{avgTimeSpent ?? '-'} min</div>
      <div className="text-gray-600 mt-2">Avg. Time Spent</div>
    </div>
  </section>
);

// Bar chart for participation data
const ParticipationChart = ({ data }) => {
  if (!data || data.length === 0) return <div>No participation data</div>;
  const maxUsers = Math.max(...data.map((d) => d.users), 1);
  return (
    <section className="bg-white rounded-lg p-8 shadow mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Participation (Last 7 Days)</h3>
      <svg width="100%" height="200">
        {data.map((d, i) => (
          <g key={d.date}>
            <rect
              x={i * 45 + 10}
              y={200 - (d.users / maxUsers) * 180}
              width="30"
              height={(d.users / maxUsers) * 180}
              fill="#5E2F7C"
              rx="4"
            />
            <text x={i * 45 + 25} y={195} fontSize="10" textAnchor="middle" fill="#444">
              {d.date.slice(5)}
            </text>
            <text
              x={i * 45 + 25}
              y={200 - (d.users / maxUsers) * 180 - 5}
              fontSize="10"
              textAnchor="middle"
              fill="#444"
            >
              {d.users}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
};

export default function AdminPanelPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Change this to your actual backend API URL
  const API_URL = "http://localhost:8000/admin/analytics"; // or use /admin/analytics if served from same domain

  useEffect(() => {
    setLoading(true);
    setError(null);

    // If you want to send a date range, populate the body below
    axios
      .post(API_URL, {
        // start_date: "2025-06-01",
        // end_date: "2025-06-07",
      })
      .then((res) => {
        setAnalytics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load analytics.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10">Loading analytics...</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Analytics Dashboard</h1>
      <StatsCards
        dailyActiveUsers={analytics?.dailyActiveUsers}
        testsCreated={analytics?.testsCreated}
        avgTimeSpent={analytics?.avgTimeSpent}
      />
      <ParticipationChart data={analytics?.participation} />
    </main>
  );
}