import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import Pagination from './Pagination';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/Skeleton';

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data?: T[];                   // static data
  fetchData?: (params: { page: number; pageSize: number; sort?: string; order?: 'asc' | 'desc'; search?: string }) => Promise<{
    items: T[];
    total: number;
  }>;
  columns: Column<T>[];
  pageSize?: number;
  initialSort?: { key: keyof T; order: 'asc' | 'desc' };
  searchPlaceholder?: string;
}

export default function DataTable<T extends { id: string | number }>({
  data: staticData,
  fetchData,
  columns,
  pageSize = 10,
  initialSort,
  searchPlaceholder = 'Search...',
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>(staticData || []);
  const [total, setTotal] = useState(staticData?.length || 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(initialSort?.key || null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSort?.order || 'asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isServerSide = !!fetchData;

  useEffect(() => {
    if (isServerSide) {
      const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
          const params: any = {
            page: currentPage,
            pageSize,
            search: searchTerm,
          };
          if (sortKey) {
            params.sort = String(sortKey);
            params.order = sortOrder;
          }
          const result = await fetchData(params);
          setData(result.items);
          setTotal(result.total);
        } catch (err: any) {
          setError(err.message || 'Failed to load data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      const timer = setTimeout(loadData, 300);
      return () => clearTimeout(timer);
    } else {
      // Static data: filter and sort
      const filtered = staticData?.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) || [];
      const sorted = sortKey
        ? [...filtered].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
          })
        : filtered;
      setTotal(sorted.length);
      const start = (currentPage - 1) * pageSize;
      setData(sorted.slice(start, start + pageSize));
    }
  }, [currentPage, pageSize, sortKey, sortOrder, searchTerm, isServerSide, staticData, fetchData]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  if (loading && data.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
        ⚠️ {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 rounded bg-red-600 px-2 py-1 text-sm text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border border-secondary-200 bg-secondary-50 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
          />
        </div>
        <span className="text-sm text-secondary-500">
          {total} results
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-secondary-200 dark:border-secondary-800">
        <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-800">
          <thead className="bg-secondary-50 dark:bg-secondary-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500 dark:text-secondary-400"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center space-x-1 hover:text-secondary-700 dark:hover:text-secondary-200"
                    >
                      <span>{col.header}</span>
                      {sortKey === col.key ? (
                        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronUp className="h-3 w-3 opacity-30" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200 bg-white dark:divide-secondary-800 dark:bg-secondary-900">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-secondary-500">
                  No results found.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50"
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="whitespace-nowrap px-4 py-3 text-sm">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-4"
      />
    </div>
  );
}
