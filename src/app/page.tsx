'use client';

import { useDashboardStore } from '@/store/dashboardStore';
import { useUsers } from '@/hooks/useUsers';
import { Loader2 } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { UserFilters } from '@/components/user-filters';
import { ViewToggle } from '@/components/view-toggle';
import { UserGrid } from '@/components/user-grid';
import { UserTable } from '@/components/user-table';
import { UserDetailModal } from '@/components/user-detail-modal';
import { DashboardPagination } from '@/components/dashboard-pagination';

export default function HomePage() {
  const viewMode = useDashboardStore((s) => s.viewMode);

  const {
    users,
    totalFiltered,
    totalPages,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useUsers();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <UserFilters />
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {isFetching && !isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {!isLoading && !isError && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {totalFiltered} result{totalFiltered !== 1 ? 's' : ''}
              </span>
            )}
            <ViewToggle />
          </div>
        </div>

        {viewMode === 'grid' ? (
          <UserGrid
            users={users}
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching && !isLoading}
            onRetry={refetch}
          />
        ) : (
          <UserTable
            users={users}
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching && !isLoading}
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && totalFiltered > 0 && (
          <DashboardPagination total={totalFiltered} totalPages={totalPages} />
        )}
      </main>

      <UserDetailModal />
    </div>
  );
}
