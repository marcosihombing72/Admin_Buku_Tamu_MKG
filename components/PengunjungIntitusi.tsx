"use client";

import { useEffect, useState } from "react";
import { Building2, Landmark, FileText } from "lucide-react";

interface InstitutionData {
  name: string;
  type: "Dinas" | "Kantor" | "Universitas" | "Umum";
  visits: number;
}

interface TamuData {
  Pengunjung?: {
    Asal_Pengunjung?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

function guessInstitutionType(name: string): InstitutionData["type"] {
  const lower = name.toLowerCase();
  if (lower.includes("universitas") || lower.includes("univ"))
    return "Universitas";
  if (lower.includes("dinas")) return "Dinas";
  if (lower.includes("kantor")) return "Kantor";
  return "Umum";
}

function getIcon(type: InstitutionData["type"]) {
  switch (type) {
    case "Universitas":
      return <Landmark className="text-blue-500" size={18} />;
    case "Kantor":
      return <Building2 className="text-green-500" size={18} />;
    case "Dinas":
      return <FileText className="text-purple-500" size={18} />;
    default:
      return null;
  }
}

export default function PengunjungIntitusi({
  data = [],
}: {
  data?: TamuData[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const institutionMap: Record<string, InstitutionData> = {};

  if (Array.isArray(data)) {
    data.forEach((item) => {
      const asal = item.Pengunjung?.Asal_Pengunjung || "Tidak diketahui";
      const tipe = guessInstitutionType(asal);

      if (!institutionMap[asal]) {
        institutionMap[asal] = {
          name: asal,
          type: tipe,
          visits: 1,
        };
      } else {
        institutionMap[asal].visits += 1;
      }
    });
  } else {
    console.warn("Prop 'data' bukan array:", data);
  }

  const institutions = Object.values(institutionMap);
  const maxVisit = institutions.length
    ? Math.max(...institutions.map((v) => v.visits))
    : 1;

  return (
    <div
      className={`bg-white rounded-2xl mb-20 shadow-md p-6 mt-6 w-full transition-all duration-700 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Asal Pengunjung
      </h3>
      {institutions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {institutions.map((visitor, idx) => {
            const barWidth = (visitor.visits / maxVisit) * 100;
            return (
              <div
                key={idx}
                className="group transition hover:bg-blue-50 rounded-lg px-4 py-3 shadow-sm border bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getIcon(visitor.type)}
                    <div>
                      <div className="font-medium text-gray-800">
                        {visitor.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {visitor.type}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-blue-700">
                    {visitor.visits}
                  </div>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">Belum ada data pengunjung.</p>
      )}
    </div>
  );
}
