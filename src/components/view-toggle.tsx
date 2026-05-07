'use client';

import { LayoutGrid, Table2 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useDashboardStore } from '@/store/dashboardStore';

export function ViewToggle() {
  const { viewMode, setViewMode } = useDashboardStore();

  return (
    <ToggleGroup
      type="single"
      value={viewMode}
      onValueChange={(v) => v && setViewMode(v as 'grid' | 'table')}
      className="border rounded-md"
    >
      <ToggleGroupItem
        value="grid"
        aria-label="Grid view"
        className="data-[state=on]:bg-muted px-2.5 py-1.5"
      >
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="table"
        aria-label="Table view"
        className="data-[state=on]:bg-muted px-2.5 py-1.5"
      >
        <Table2 className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
