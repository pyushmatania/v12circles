import 'react-table';

declare module 'react-table' {
  export interface TableInstance<D extends object = object> {
    page: Row<D>[];
    canPreviousPage: boolean;
    canNextPage: boolean;
    pageCount: number;
    gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
    nextPage: () => void;
    previousPage: () => void;
  }

  export interface TableState {
    pageIndex: number;
    pageSize: number;
  }

  export interface TableOptions {
    manualSortBy?: boolean;
    disableSortBy?: boolean;
  }
} 