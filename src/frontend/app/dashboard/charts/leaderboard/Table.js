import React, { useState } from "react";
import data from "./Data.json"; // adjust path if needed

const headers = [
  { label: "#", key: "position" },
  { label: "Nome", key: "nome" },
  { label: "Distrito", key: "distrito" },
  { label: "Concelho", key: "concelho" },
  { label: "KMs Percorridos", key: "kmsPercorridos" },
];

export function Leaderboard() {
  // Default: sorted by leaderboard
  const [sortConfig, setSortConfig] = useState({
    key: "position",
    direction: "asc", // Top of leaderboard = 1
  });

  // For ranking: descending KMs
  const ranking = React.useMemo(() => {
    return [...data]
      .sort((a, b) => b.kmsPercorridos - a.kmsPercorridos)
      .map((entry) => entry.nome); // Use entry.id if you have unique IDs
  }, [data]);

  // Sorting logic
  const sortedData = React.useMemo(() => {
    // Sort by position (leaderboard)
    if (!sortConfig.key || sortConfig.key === "position") {
      const sorted = [...data].sort((a, b) => {
        const aRank = ranking.indexOf(a.nome);
        const bRank = ranking.indexOf(b.nome);
        return sortConfig.direction === "asc" ? aRank - bRank : bRank - aRank;
      });
      return sorted;
    }
    // Sort by other columns
    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (!isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue))) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else {
        aValue = aValue?.toString().toLowerCase() || "";
        bValue = bValue?.toString().toLowerCase() || "";
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [sortConfig, data, ranking]);

  const handleSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return { key, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      // For leaderboard: default to asc (1 at top), for others: asc
      return { key, direction: "asc" };
    });
  };

  return (
    <div
      style={{
        borderRadius: 20,
        border: "1px solid #E0E0E0",
        overflow: "hidden",
        margin: 20,
        fontFamily: "Quicksand, sans-serif",
        background: "#fff",
      }}
    >
      <table className="w-full border border-gray-200 bg-background text-base">
        <thead>
          <tr className="divide-x divide-gray-200">
            <th className="w-1/4 px-2 py-2 text-left border-b border-gray-200 bg-background">
              #
            </th>
            <th className="w-1/2 px-2 py-2 text-left border-b border-gray-200 bg-background">
              Distrito
            </th>
            <th className="w-1/4 px-2 py-2 text-left border-b border-gray-200 bg-background">
              Kms
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr key={row.id || i} className="divide-x divide-gray-200">
              <td className="w-1/4 px-2 py-2 border-gray-200 bg-background text-left pl-2">
                {i + 1}
              </td>
              <td className="w-1/2 px-2 py-2 border-gray-200 bg-background">
                {row.distrito}
              </td>
              <td className="w-1/4 px-2 py-2 border-gray-200 bg-background text-left">
                {row.kmsPercorridos}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
