'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, Search } from 'lucide-react';

export interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
  actions?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search records...',
  pageSize = 10,
  emptyMessage = 'No matching records found.',
  actions,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const q = searchTerm.toLowerCase();
    return data.filter((item) => {
      if (searchKey) {
        return String(item[searchKey] || '')
          .toLowerCase()
          .includes(q);
      }
      return Object.values(item).some((val) =>
        String(val || '')
          .toLowerCase()
          .includes(q)
      );
    });
  }, [data, searchTerm, searchKey]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      return sortOrder === 'asc' ? 1 : -1;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
          />
        </div>
        {actions && <div className="flex items-center gap-2 w-full sm:w-auto">{actions}</div>}
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/75 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-5 py-3.5 whitespace-nowrap ${col.className || ''}`}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div
                    className={`flex items-center gap-1.5 ${
                      col.sortable ? 'cursor-pointer hover:text-slate-800 select-none' : ''
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/60 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-5 py-3.5 whitespace-nowrap ${col.className || ''}`}>
                      {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="px-5 py-3.5 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-800">
            {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-800">
            {Math.min(currentPage * pageSize, sortedData.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-800">{sortedData.length}</span> entries
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
