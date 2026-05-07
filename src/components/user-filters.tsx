'use client';

import { useRef } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDashboardStore } from '@/store/dashboardStore';
import type { GenderFilter, RoleFilter } from '@/types/user';

export function UserFilters() {
  const {
    filters,
    setSearch,
    setGender,
    setRole,
    setAgeMin,
    setAgeMax,
    resetFilters,
  } = useDashboardStore();

  const searchRef = useRef<HTMLInputElement>(null);

  const activeFilterCount = [
    filters.gender !== 'all',
    filters.role !== 'all',
    filters.ageMin !== '',
    filters.ageMax !== '',
  ].filter(Boolean).length;

  const hasSearch = filters.search !== '';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={searchRef}
          placeholder="Search by name, email, company…"
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-9"
        />
        {hasSearch && (
          <button
            onClick={() => {
              setSearch('');
              searchRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Advanced Filters</h4>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Gender
              </Label>
              <div className="flex gap-2">
                {(['all', 'male', 'female'] as GenderFilter[]).map((g) => (
                  <Button
                    key={g}
                    size="sm"
                    variant={filters.gender === g ? 'default' : 'outline'}
                    className="flex-1 capitalize text-xs h-8"
                    onClick={() => setGender(g)}
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Role
              </Label>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'admin', 'moderator', 'user'] as RoleFilter[]).map(
                  (r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant={filters.role === r ? 'default' : 'outline'}
                      className="capitalize text-xs h-8"
                      onClick={() => setRole(r)}
                    >
                      {r}
                    </Button>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Age range
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  min={0}
                  max={120}
                  value={filters.ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                  className="h-8 text-sm"
                />
                <span className="text-muted-foreground text-sm">–</span>
                <Input
                  type="number"
                  placeholder="Max"
                  min={0}
                  max={120}
                  value={filters.ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={resetFilters}
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Reset filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <SortDropdown />

      {(activeFilterCount > 0 || hasSearch) && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground shrink-0"
          onClick={resetFilters}
        >
          <X className="h-4 w-4 mr-1" />
          Clear all
        </Button>
      )}
    </div>
  );
}

function SortDropdown() {
  const { filters, toggleSort } = useDashboardStore();

  const sortOptions = [
    { value: 'firstName', label: 'First name' },
    { value: 'lastName', label: 'Last name' },
    { value: 'age', label: 'Age' },
    { value: 'email', label: 'Email' },
    { value: 'company', label: 'Company' },
  ] as const;

  const current = sortOptions.find((o) => o.value === filters.sortField);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
          Sort: {current?.label}
          <span className="text-muted-foreground text-xs">
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs">Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={filters.sortField}>
          {sortOptions.map(({ value, label }) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              onClick={() => toggleSort(value)}
              className="text-sm cursor-pointer"
            >
              {label}
              {filters.sortField === value && (
                <span className="ml-auto text-muted-foreground text-xs">
                  {filters.sortOrder === 'asc' ? '↑ asc' : '↓ desc'}
                </span>
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
