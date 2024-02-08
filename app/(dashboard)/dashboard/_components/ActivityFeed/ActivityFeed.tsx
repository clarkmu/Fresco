'use client';

import { DataTableSkeleton } from '~/components/data-table/data-table-skeleton';
import ActivityFeedTable from './ActivityFeedTable';
import { unstable_noStore } from 'next/cache';
import { api } from '~/trpc/client';
import { useTableStateFromSearchParams } from './useTableStateFromSearchParams';

export const ActivityFeed = () => {
  const { searchParams } = useTableStateFromSearchParams();

  unstable_noStore();
  const tableQuery = api.dashboard.getActivities.useQuery(searchParams);

  if (tableQuery.isLoading) {
    return <DataTableSkeleton columnCount={3} filterableColumnCount={1} />;
  }

  return (
    <ActivityFeedTable
      data={tableQuery.data?.tableData}
      pageCount={tableQuery.data?.pageCount}
    />
  );
};
