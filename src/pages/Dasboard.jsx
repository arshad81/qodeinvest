import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import nav from "../data/nav.json";
import Sidebar from "../components/Sidebar";

// Prepare the data
const navData = nav.map((item) => ({
  date: item.date,
  nav: item.nav,
}));

export default function EquityCurve() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredData = [...navData]
    .reverse()
    .filter((item) => {
      const itemDate = new Date(item.date.split("-").reverse().join("-")); // convert DD-MM-YYYY → YYYY-MM-DD
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) return itemDate >= start && itemDate <= end;
      if (start) return itemDate >= start;
      if (end) return itemDate <= end;
      return true;
    });


  return (
    <div className="md:flex h-screen">
      <Sidebar />
      <div className="md:ml-64 w-full">
        <div className=" mx-auto p-4 bg-white rounded-lg ">
          <div className="md:flex justify-between items-center">
            <div className="mb-4">
              <h2 className="text-lg font-bold ">Equity Curve</h2>
              <div className="flex justify-between md:justify-start gap-x-4">
                <p>Live Since {navData[0].date}</p>
                <p className="text-red-500 cursor-pointer" onClick={() => { setStartDate(''); setEndDate('') }}>Reset</p>
              </div>
            </div>

            {/* Date inputs */}
            <div className="flex gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  className="border rounded p-1"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  className="border rounded p-1"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="nav"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

  );
}
