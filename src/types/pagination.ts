export interface PaginatedPageUrl {
  current?: string;
  next?: string | null;
  prev?: string | null;
  first?: string;
  last?: string;
}

export interface PaginatedPage<T> {
  currentPage: number;
  data: T[];
  lastPage: number;
  url: PaginatedPageUrl;
}

export type PaginateFunction<
  T,
  TParams extends Record<string, string> = Record<string, never>,
> = (
  data: T[],
  options: {
    pageSize: number;
    params?: TParams;
  },
) => unknown;
