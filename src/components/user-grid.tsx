'use client';

import { AlertCircle, SearchX, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import type { User } from '@/types/user';
import { UserCard } from './user-card';
import { cn } from '@/lib/utils';

interface UserGridProps {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
}

export function UserGrid({
  users,
  isLoading,
  isError,
  isFetching,
  onRetry,
}: UserGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <GridCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (users.length === 0) {
    return <EmptyState />;
  }

  return (
    <div
      className={cn(
        'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        isFetching && 'opacity-60 pointer-events-none transition-opacity',
      )}
    >
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

function GridCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          {[32, 24, 36, 20].map((w, i) => (
            <Skeleton key={i} className="h-3" style={{ width: `${w * 3}px` }} />
          ))}
        </div>
        <div className="mt-4 pt-3 border-t flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-5 w-14 rounded-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
      <SearchX className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="font-semibold text-lg">No users found</h3>
      <p className="text-muted-foreground text-sm max-w-xs">
        Try adjusting your search or filters to find what you&apos;re looking
        for.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
      <AlertCircle className="h-12 w-12 text-destructive/70" />
      <h3 className="font-semibold text-lg">Failed to load users</h3>
      <p className="text-muted-foreground text-sm max-w-xs">
        Something went wrong while fetching data. Please try again.
      </p>
      <Button onClick={onRetry} variant="outline" className="gap-2 mt-1">
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}
