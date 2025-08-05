// components/Pagination.tsx
"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  // Perhitungan yang benar untuk menghindari bug nomor urut
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Fungsi untuk menampilkan nomor halaman dengan elipsis jika terlalu banyak
  const renderPageNumbers = () => {
    const maxVisiblePages = 5;
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      // Jika total halaman sedikit, tampilkan semua
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Jika banyak halaman, tampilkan dengan elipsis
      if (currentPage <= 3) {
        // Halaman awal: 1, 2, 3, 4, ..., last
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Halaman akhir: 1, ..., last-3, last-2, last-1, last
        pages.push(1);
        if (totalPages > 4) {
          pages.push("...");
        }
        for (let i = totalPages - 3; i <= totalPages; i++) {
          if (i > 1) pages.push(i);
        }
      } else {
        // Halaman tengah: 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = renderPageNumbers();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-3">
      {/* Info pagination */}
      <p className="text-sm text-gray-600">
        Menampilkan{" "}
        <span className="font-medium">
          {totalItems === 0 ? 0 : startIndex + 1}
        </span>{" "}
        - <span className="font-medium">{endIndex}</span> dari{" "}
        <span className="font-medium">{totalItems}</span> tamu
      </p>

      {/* Navigasi halaman */}
      <div className="flex items-center justify-between gap-2">
        {/* Tombol Previous */}
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm bg-white text-blue-700 hover:bg-blue-50 hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-md"
        >
          Sebelumnya
        </button>

        {/* Nomor halaman */}
        <div className="flex gap-1 items-center mx-2">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-500"
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = currentPage === pageNumber;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`w-9 h-9 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-blue-700 border border-gray-300 hover:bg-blue-50"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Tombol Next */}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 text-sm bg-white text-blue-700 hover:bg-blue-50 hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-md"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
