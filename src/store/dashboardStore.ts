import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DashboardFilters,
  ViewMode,
  SortField,
  SortOrder,
  GenderFilter,
  RoleFilter,
} from '@/types/user';

const DEFAULT_FILTERS: DashboardFilters = {
  search: '',
  gender: 'all',
  role: 'all',
  ageMin: '',
  ageMax: '',
  sortField: 'firstName',
  sortOrder: 'asc',
};

interface DashboardState {
  viewMode: ViewMode;
  filters: DashboardFilters;
  page: number;
  pageSize: number;
  selectedUserId: number | null;
}

interface DashboardActions {
  setViewMode: (value: ViewMode) => void;
  setSearch: (value: string) => void;
  setGender: (value: GenderFilter) => void;
  setRole: (value: RoleFilter) => void;
  setAgeMin: (value: string) => void;
  setAgeMax: (value: string) => void;
  setSortField: (value: SortField) => void;
  setSortOrder: (value: SortOrder) => void;
  toggleSort: (value: SortField) => void;
  resetFilters: () => void;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
  setSelectedUserId: (value: number | null) => void;
}

export const useDashboardStore = create<DashboardState & DashboardActions>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      filters: DEFAULT_FILTERS,
      page: 1,
      pageSize: 12,
      selectedUserId: null,

      setViewMode: (viewMode) => set({ viewMode }),

      setSearch: (search) =>
        set((s) => ({
          filters: { ...s.filters, search },
          page: 1,
        })),

      setGender: (gender) =>
        set((s) => ({
          filters: { ...s.filters, gender },
          page: 1,
        })),

      setRole: (role) =>
        set((s) => ({
          filters: { ...s.filters, role },
          page: 1,
        })),

      setAgeMin: (ageMin) =>
        set((s) => ({
          filters: { ...s.filters, ageMin },
          page: 1,
        })),

      setAgeMax: (ageMax) =>
        set((s) => ({
          filters: { ...s.filters, ageMax },
          page: 1,
        })),

      setSortField: (sortField) =>
        set((s) => ({ filters: { ...s.filters, sortField } })),

      setSortOrder: (sortOrder) =>
        set((s) => ({ filters: { ...s.filters, sortOrder } })),

      toggleSort: (field) =>
        set((s) => {
          const same = s.filters.sortField === field;
          return {
            filters: {
              ...s.filters,
              sortField: field,
              sortOrder: same && s.filters.sortOrder === 'asc' ? 'desc' : 'asc',
            },
          };
        }),

      resetFilters: () => set({ filters: DEFAULT_FILTERS, page: 1 }),

      setPage: (page) => set({ page }),
      setPageSize: (pageSize) => set({ pageSize, page: 1 }),
      setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
    }),
    {
      name: 'dashboard-store',
      partialize: (s) => ({
        viewMode: s.viewMode,
        pageSize: s.pageSize,
      }),
    },
  ),
);
