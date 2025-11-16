import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export const PeopleLoading = () => (
  <DataTableSkeleton columnCount={5} rowCount={10} />
);
