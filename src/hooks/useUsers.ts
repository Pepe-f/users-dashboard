'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/api/api';
import { applyClientFilters } from '@/lib/utils';
import { useDashboardStore } from '@/store/dashboardStore';
import { useDebounce } from './useDebounce';

const SORT_MAP: Record<string, string> = {
  firstName: 'firstName',
  lastName: 'lastName',
  age: 'age',
  email: 'email',
  company: 'company.name',
};

const FETCH_LIMIT = 100;

export function useUsers() {
  const { filters, page, pageSize } = useDashboardStore();
  const debouncedSearch = useDebounce(filters.search, 400);

  const query = useQuery({
    queryKey: [
      'users',
      {
        search: debouncedSearch,
        sortField: filters.sortField,
        sortOrder: filters.sortOrder,
      },
    ],
    queryFn: () =>
      fetchUsers({
        limit: FETCH_LIMIT,
        skip: 0,
        search: debouncedSearch || undefined,
        sortBy: SORT_MAP[filters.sortField],
        order: filters.sortOrder,
      }),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

  const allUsers = query.data?.users ?? [];
  const filtered = applyClientFilters(allUsers, filters);

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  const start = (page - 1) * pageSize;
  const paginatedUsers = filtered.slice(start, start + pageSize);

  return {
    users: paginatedUsers,
    allFilteredUsers: filtered,
    totalFiltered,
    totalPages,
    serverTotal: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
