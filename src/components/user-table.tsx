'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, AlertCircle, RefreshCw, SearchX } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { fullName, getInitials, roleColors, genderIcon, cn } from '@/lib/utils';
import type { User, SortField } from '@/types/user';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
}

export function UserTable({
  users,
  isLoading,
  isError,
  isFetching,
  onRetry,
}: UserTableProps) {
  const { setSelectedUserId } = useDashboardStore();

  const columns: ColumnDef<User>[] = [
    {
      id: 'user',
      header: () => <SortHeader field="firstName" label="User" />,
      cell: ({ row: { original: u } }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage
              src={u.image}
              alt={fullName(u)}
              className="object-cover"
            />
            <AvatarFallback className="bg-linear-to-br from-blue-400 to-violet-500 text-white text-xs font-semibold">
              {getInitials(u.firstName, u.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              {fullName(u)}
              <span className="ml-1.5 text-muted-foreground text-xs">
                {genderIcon(u.gender)}
              </span>
            </p>
            <p className="text-xs text-muted-foreground truncate">
              @{u.username}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'age',
      header: () => <SortHeader field="age" label="Age" />,
      cell: ({ row }) => <span className="text-sm">{row.original.age}</span>,
    },
    {
      id: 'email',
      header: () => <SortHeader field="email" label="Email" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.email}
        </span>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {row.original.phone}
        </span>
      ),
    },
    {
      id: 'company',
      header: () => <SortHeader field="company" label="Company" />,
      cell: ({ row: { original: u } }) => (
        <div>
          <p className="text-sm font-medium">{u.company.name}</p>
          <p className="text-xs text-muted-foreground">
            {u.company.department}
          </p>
        </div>
      ),
    },
    {
      id: 'location',
      header: 'Location',
      cell: ({ row: { original: u } }) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {u.address.city}, {u.address.country}
        </span>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge className={cn('text-xs', roleColors(row.original.role))}>
          {row.original.role}
        </Badge>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertCircle className="h-12 w-12 text-destructive/70" />
        <h3 className="font-semibold">Failed to load users</h3>
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <SearchX className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="font-semibold">No users found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border/60 overflow-hidden',
        isFetching && 'opacity-60 pointer-events-none transition-opacity',
      )}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/40 hover:bg-muted/40">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap text-xs"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedUserId(row.original.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SortHeader({ field, label }: { field: SortField; label: string }) {
  const { filters, toggleSort } = useDashboardStore();
  const isActive = filters.sortField === field;

  return (
    <button
      onClick={() => toggleSort(field)}
      className={cn(
        'flex items-center gap-1 text-xs font-semibold uppercase tracking-wide',
        'hover:text-foreground transition-colors',
        isActive ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      {label}
      <ArrowUpDown className={cn('h-3.5 w-3.5', isActive && 'text-primary')} />
      {isActive && (
        <span className="text-primary">
          {filters.sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-lg border border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {[
              'User',
              'Age',
              'Email',
              'Phone',
              'Company',
              'Location',
              'Role',
            ].map((h) => (
              <TableHead key={h} className="text-xs">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </TableCell>
              {[24, 40, 32, 36, 20, 16].map((w, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-3.5" style={{ width: w * 3 }} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
