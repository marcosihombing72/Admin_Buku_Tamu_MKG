"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchTamuProps {
  value: string;
  onChange: (value: string) => void;
  className?: string; // Tambahkan agar bisa override dari luar
}

export default function SearchTamu({
  value,
  onChange,
  className,
}: SearchTamuProps) {
  return (
    <div className={`relative ${className || "w-full md:w-1/2"}`}>
      <Search className="absolute top-2.5 left-3 text-gray-400" size={16} />
      <input
        type="text"
        placeholder="Cari nama tamu..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}
