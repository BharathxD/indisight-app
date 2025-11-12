import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export const UsersLoading = () => (
  <DataTableSkeleton columnCount={6} rowCount={10} />
);
