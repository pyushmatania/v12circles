import React from 'react';
import { useTable, usePagination, useSortBy, Row, Cell } from 'react-table';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTheme } from '../../ThemeContext';

interface DataTableProps<T extends object> {
  columns: unknown[]; // Using unknown[] to avoid strict typing issues
  data: T[];
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const DataTable = <T extends object>({ 
  columns, 
  data,
  onSort,
  sortField,
  sortDirection
}: DataTableProps<T>) => {
  const { theme } = useTheme();
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualSortBy: !!onSort,
      disableSortBy: !onSort
    },
    useSortBy,
    usePagination
  );

  const handleSort = (column: { id?: string }) => {
    if (onSort && column.id) {
      onSort(column.id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <table 
          {...getTableProps()} 
          className="w-full"
        >
          <thead className={`${
            theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'
          }`}>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}
                    onClick={() => handleSort(column)}
                    style={{ cursor: onSort ? 'pointer' : 'default' }}
                  >
                    <div className="flex items-center gap-2">
                      {column.render('Header')}
                      {onSort && sortField === column.id && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className={`${
              theme === 'light' ? 'bg-white divide-y divide-gray-200' : 'divide-y divide-gray-700'
            }`}
          >
            {page.map((row: Row<T>) => {
              prepareRow(row);
              return (
                <tr 
                  {...row.getRowProps()}
                  className={`${
                    theme === 'light' 
                      ? 'hover:bg-gray-50' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  {row.cells.map((cell: Cell<T>) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`px-4 py-3 flex items-center justify-between border-t ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
      }`}>
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                : 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
            } ${!canPreviousPage && 'opacity-50 cursor-not-allowed'}`}
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
              theme === 'light'
                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                : 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
            } ${!canNextPage && 'opacity-50 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Showing <span className="font-medium">{pageIndex * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min((pageIndex + 1) * pageSize, data.length)}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                } ${!canPreviousPage && 'opacity-50 cursor-not-allowed'}`}
              >
                <span className="sr-only">First</span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                } ${!canPreviousPage && 'opacity-50 cursor-not-allowed'}`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {/* Page Numbers */}
              {[...Array(Math.min(5, pageCount))].map((_, index) => {
                const pageNum = pageIndex - 2 + index;
                if (pageNum >= 0 && pageNum < pageCount) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => gotoPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === pageIndex
                          ? theme === 'light'
                            ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                            : 'z-10 bg-purple-900 border-purple-500 text-purple-300'
                          : theme === 'light'
                            ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                } ${!canNextPage && 'opacity-50 cursor-not-allowed'}`}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                } ${!canNextPage && 'opacity-50 cursor-not-allowed'}`}
              >
                <span className="sr-only">Last</span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;