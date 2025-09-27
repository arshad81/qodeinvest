import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import nav from "../data/nav.json";
import Sidebar from "../components/Sidebar";

// Calculate drawdown
let peak = -Infinity;
const navData = [...nav]
  .reverse()
  .map((item) => {
    const date = item.date;
    const navValue = item.nav;
    peak = Math.max(peak, navValue);
    const drawdown = ((navValue / peak - 1) * 100);
    return { date, nav: navValue, drawdown };
  });

// Calculate month-on-month returns
const monthlyReturns = [];
const navByMonth = {};

navData.forEach((item) => {
  const date = new Date(item.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const key = `${year}-${month.toString().padStart(2, "0")}`;

  if (!navByMonth[key]) navByMonth[key] = [];
  navByMonth[key].push(item.nav);
});

for (const key in navByMonth) {
  const navs = navByMonth[key];
  const startNav = navs[0];
  const endNav = navs[navs.length - 1];
  const returnPercent = ((endNav / startNav - 1) * 100).toFixed(2);
  monthlyReturns.push({ month: key, return: Number(returnPercent) });
}

// Calculate year-on-year returns
const yearlyReturns = {};
const navByYear = {};

navData.forEach((item) => {
  const date = new Date(item.date);
  const year = date.getFullYear();

  if (!navByYear[year]) navByYear[year] = [];
  navByYear[year].push(item.nav);
});

for (const year in navByYear) {
  const navs = navByYear[year];
  const startNav = navs[0];
  const endNav = navs[navs.length - 1];
  const returnPercent = ((endNav / startNav - 1) * 100).toFixed(2);
  yearlyReturns[year] = Number(returnPercent);
}

// Extract unique years
const years = Object.keys(yearlyReturns).sort();

export default function PortfolioPage() {
  // Default to All
  const [selectedYear, setSelectedYear] = useState(null);

  // Filter NAV data by year or show all
  const filteredDataByYear = selectedYear
    ? navData.filter((item) => new Date(item.date).getFullYear() === selectedYear)
    : navData;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getMonthlyReturnRow = (year) => {
    return monthNames.map((m, idx) => {
      const monthKey = `${year}-${(idx + 1).toString().padStart(2, "0")}`;
      const monthObj = monthlyReturns.find(item => item.month === monthKey);
      return monthObj && !isNaN(monthObj.return) ? monthObj.return : "All";
    });
  };

  return (
    <div className="md:flex h-screen">
      <Sidebar />
      <div className="md:ml-64 w-full overflow-y-auto p-4">
        <div className="mx-auto bg-white rounded-lg p-4">

          {/* Header & Year Filter */}
          <div className="md:flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold">Portfolio Overview</h2>
              <p>Live Since {navData[0].date}</p>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <label className="font-medium">Select Year:</label>
              <select
                value={selectedYear ?? "All"}
                onChange={(e) => setSelectedYear(e.target.value === "All" ? null : Number(e.target.value))}
                className="border rounded p-1"
              >
                <option value="All">All</option>
                {years.map((year) => (
                  !isNaN(year) &&
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <h3 className="font-semibold mt-6 mb-2">
            {selectedYear ? `Monthly Returns - ${selectedYear}` : "Yearly Returns"}
          </h3>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border border-gray-200 rounded-lg text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">{selectedYear ? "Month" : "Year"}</th>
                  {(selectedYear ? monthNames : years).map((item) => (
                    isNaN(item) ?
                      <th key={item} className="px-4 py-2">{"All"}</th> :
                      <th key={item} className="px-4 py-2">{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 font-medium">Return (%)</td>
                  {(selectedYear
                    ? getMonthlyReturnRow(selectedYear)
                    : years.map(y => yearlyReturns[y])
                  ).map((r, idx) => (
                    <td
                      key={idx}
                      className={`px-4 py-2 ${r === "All" ? "" : r >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {isNaN(r) ? "All" : r + "%"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          {/* Equity Curve */}
          <h3 className="font-semibold mb-2">Equity Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredDataByYear}>
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="nav" stroke="#4f46e5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>

          {/* Drawdown Chart */}
          <h3 className="font-semibold mt-6 mb-2">Drawdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={filteredDataByYear}>
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              <Area type="monotone" dataKey="drawdown" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>




        </div>
      </div>
    </div>
  );
}
