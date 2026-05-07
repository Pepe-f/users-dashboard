'use client';

import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/store/dashboardStore';

interface DashboardPaginationProps {
  total: number;
  totalPages: number;
}

const PAGE_SIZES = [6, 12, 24, 48];

export function DashboardPagination({
  total,
  totalPages,
}: DashboardPaginationProps) {
  const { page, setPage } = useDashboardStore();

  if (totalPages <= 1 && total <= PAGE_SIZES[0]) return null;

  function getPageNumbers(): (number | 'ellipsis-start' | 'ellipsis-end')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1];
    if (page > 3) pages.push('ellipsis-start');
    const surroundStart = Math.max(2, page - 1);
    const surroundEnd = Math.min(totalPages - 1, page + 1);
    for (let i = surroundStart; i <= surroundEnd; i++) pages.push(i);
    if (page < totalPages - 2) pages.push('ellipsis-end');
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="flex items-center">
      <Pagination>
        <PaginationContent className="gap-0.5">
          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
          </PaginationItem>

          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </PaginationItem>

          {getPageNumbers().map((p) =>
            p === 'ellipsis-start' || p === 'ellipsis-end' ? (
              <PaginationItem key={p}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <Button
                  variant={page === p ? 'default' : 'ghost'}
                  size="icon"
                  className="h-8 w-8 text-sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>

          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
