"use client";

import React, { useState, useMemo } from "react";
import { clsx } from "clsx";
import { ChevronDown, ChevronUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  selectedIds?: string[];
  onSelectRow?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  className?: string;
  pageSize?: number;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  onRowClick,
  emptyState,
  className,
  pageSize = 10,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === "asc") setSortOrder("desc");
      else {
        setSortKey(null);
        setSortOrder("asc");
      }
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;

    return [...data].sort((a, b) => {
      const valA = col.accessor(a);
      const valB = col.accessor(b);

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      const strA = String(valA ?? "").toLowerCase();
      const strB = String(valB ?? "").toLowerCase();

      if (strA < strB) return sortOrder === "asc" ? -1 : 1;
      if (strA > strB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder, columns]);

  const totalPages = pageSize > 0 ? Math.ceil(sortedData.length / pageSize) : 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const paginatedData = useMemo(() => {
    if (!pageSize || pageSize <= 0) return sortedData;
    const startIdx = (validCurrentPage - 1) * pageSize;
    return sortedData.slice(startIdx, startIdx + pageSize);
  }, [sortedData, validCurrentPage, pageSize]);

  return (
    <div className={clsx("w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xs select-none flex flex-col", className)}>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
              {onSelectAll && (
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    aria-label="Select all rows"
                    className="neu-pressed w-4 h-4 accent-[var(--accent)] rounded cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={clsx(
                    "p-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-faint)]",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.sortable && "cursor-pointer hover:text-[var(--foreground)] transition-colors"
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={clsx("inline-flex items-center gap-1", col.align === "right" && "flex-row-reverse")}>
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-[var(--foreground-muted)]">
                        {sortKey === col.key ? (
                          sortOrder === "asc" ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectAll ? 1 : 0)}
                  className="p-8 text-center text-[var(--foreground-muted)] font-medium text-[13px]"
                >
                  {emptyState || "No records found."}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={clsx(
                      "transition-colors hover:bg-[var(--surface-muted)]/70",
                      isSelected && "bg-[var(--accent-soft)]/40",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {onSelectRow && (
                      <td
                        className="p-3 w-10 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelectRow(row.id, e.target.checked)}
                          aria-label={`Select row ${row.id}`}
                          className="neu-pressed w-4 h-4 accent-[var(--accent)] rounded cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={clsx(
                          "p-3 text-[13px] text-[var(--foreground)]",
                          col.align === "right" && "text-right font-medium tabular-nums",
                          col.align === "center" && "text-center"
                        )}
                      >
                        {col.accessor(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar (8.16) */}
      {pageSize > 0 && sortedData.length > 0 && (
        <div className="px-4 py-2.5 bg-[var(--surface-muted)] border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--foreground-muted)]">
          <div>
            Showing{" "}
            <span className="font-bold text-[var(--foreground)]">
              {(validCurrentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-[var(--foreground)]">
              {Math.min(validCurrentPage * pageSize, sortedData.length)}
            </span>{" "}
            of <span className="font-bold text-[var(--foreground)]">{sortedData.length}</span> entries
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                aria-label="Previous page"
                className="px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] disabled:opacity-40 hover:bg-[var(--surface-muted)] transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-0.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <span className="px-2 font-semibold text-[var(--foreground)]">
                Page {validCurrentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
                aria-label="Next page"
                className="px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] disabled:opacity-40 hover:bg-[var(--surface-muted)] transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-0.5"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
