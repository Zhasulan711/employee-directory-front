import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Container,
  Divider,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";
import {
  DEFAULT_PAGE_SIZE,
  EMPTY_FILTERS,
  PAGE_SIZE_OPTIONS,
} from "../constants/employees";
import { useEmployees } from "../hooks/useEmployees";
import type {
  Department,
  EmployeeFilters,
  EmployeesQuery,
  SortField,
  SortState,
} from "../types/employee";
import { ActiveFilters } from "./ActiveFilters";
import { EmployeesTable } from "./EmployeesTable";
import { EmployeesToolbar } from "./EmployeesToolbar";
import { FiltersModal } from "./FiltersModal";

const PAGE_SIZE_VALUES: readonly number[] = PAGE_SIZE_OPTIONS;

const ROWS_PER_PAGE_OPTIONS = [...PAGE_SIZE_VALUES];

const PAGE_WRAPPER_SX = {
  minHeight: "100%",
  backgroundColor: "background.default",
  py: 4,
} as const;

function countActiveFilters(filters: EmployeeFilters): number {
  let count = 0;
  if (filters.search.trim().length > 0) count += 1;
  if (filters.role !== null) count += 1;
  count += filters.departments.length;
  return count;
}

function renderDisplayedRows({
  from,
  to,
  count,
}: {
  from: number;
  to: number;
  count: number;
}): string {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

export function EmployeesPage() {
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [sort, setSort] = useState<SortState | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  const query = useMemo<EmployeesQuery>(
    () => ({ page, pageSize, sort, filters }),
    [page, pageSize, sort, filters],
  );

  const { data, loading, error } = useEmployees(query);

  const handleSortChange = useCallback((field: SortField) => {
    setSort((current) => {
      if (current?.field !== field) {
        return { field, order: "asc" };
      }
      if (current.order === "asc") {
        return { field, order: "desc" };
      }
      return null;
    });
    setPage(0);
  }, []);

  const handlePageChange = useCallback((_event: unknown, nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageSize(Number(event.target.value));
      setPage(0);
    },
    [],
  );

  const handleApplyFilters = useCallback((next: EmployeeFilters) => {
    setFilters(next);
    setPage(0);
    setFiltersOpen(false);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(0);
    setFiltersOpen(false);
  }, []);

  const handleClearSearch = useCallback(() => {
    setFilters((prev) => ({ ...prev, search: "" }));
    setPage(0);
  }, []);

  const handleClearRole = useCallback(() => {
    setFilters((prev) => ({ ...prev, role: null }));
    setPage(0);
  }, []);

  const handleRemoveDepartment = useCallback((department: Department) => {
    setFilters((prev) => ({
      ...prev,
      departments: prev.departments.filter((item) => item !== department),
    }));
    setPage(0);
  }, []);

  const handleOpenFilters = useCallback(() => {
    setFiltersOpen(true);
  }, []);

  const handleCloseFilters = useCallback(() => {
    setFiltersOpen(false);
  }, []);

  const activeFiltersCount = useMemo(
    () => countActiveFilters(filters),
    [filters],
  );

  return (
    <Box sx={PAGE_WRAPPER_SX}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Employee Directory
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Browse, search and filter company employees
          </Typography>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        ) : null}

        <Paper elevation={1}>
          <EmployeesToolbar
            total={data.total}
            activeFiltersCount={activeFiltersCount}
            onOpenFilters={handleOpenFilters}
          />
          <ActiveFilters
            filters={filters}
            onClearSearch={handleClearSearch}
            onClearRole={handleClearRole}
            onRemoveDepartment={handleRemoveDepartment}
            onResetAll={handleResetFilters}
          />
          <Divider />
          <EmployeesTable
            rows={data.items}
            loading={loading}
            sort={sort}
            onSortChange={handleSortChange}
          />
          <Divider />
          <TablePagination
            component="div"
            count={data.total}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={renderDisplayedRows}
          />
        </Paper>

        <FiltersModal
          open={filtersOpen}
          initialFilters={filters}
          onClose={handleCloseFilters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      </Container>
    </Box>
  );
}
