import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  pageSize?: number;
  emptyMessage?: string;
  actionButton?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFilter,
  pageSize = 8,
  emptyMessage = 'No records found matching query.',
  actionButton,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filteredData = searchFilter
    ? data.filter((item) => searchFilter(item, query))
    : data;

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const currentRecords = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full space-y-4">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9AA8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#130E22] border border-[#2A2240] text-sm text-white placeholder-[#9E9AA8] focus:outline-none focus:border-[#00E5FF] transition-colors"
          />
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>

      {/* Table Surface */}
      <div className="overflow-x-auto rounded-xl border border-[#2A2240] bg-[#130E22]/90 shadow-xl">
        <table className="w-full text-left text-xs text-white">
          <thead className="bg-[#1C1533] text-[#9E9AA8] uppercase text-[11px] font-semibold tracking-wider border-b border-[#2A2240]">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`py-3.5 px-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2240]/60">
            {currentRecords.length > 0 ? (
              currentRecords.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-[#1C1533]/60 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`py-3 px-4 ${col.className || ''}`}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-[#9E9AA8]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-[#9E9AA8]/50" />
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-[#9E9AA8] pt-2">
          <span>
            Showing {(page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, filteredData.length)} of {filteredData.length} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-[#2A2240] bg-[#130E22] hover:bg-[#1C1533] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <span className="text-white font-medium">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-[#2A2240] bg-[#130E22] hover:bg-[#1C1533] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
