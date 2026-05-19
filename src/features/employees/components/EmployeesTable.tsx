import {
  Box,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import type { Employee, SortField, SortState } from "../types/employee";

interface EmployeesTableProps {
  rows: Employee[];
  loading: boolean;
  sort: SortState | null;
  onSortChange: (field: SortField) => void;
}

interface ColumnDef {
  id: "id" | "name" | "email" | "role" | "department";
  label: string;
  sortable: boolean;
  sortField?: SortField;
  width?: string | number;
}

const COLUMNS: readonly ColumnDef[] = [
  { id: "id", label: "ID", sortable: false, width: 80 },
  { id: "name", label: "First / Last name", sortable: false },
  { id: "email", label: "Email", sortable: false },
  { id: "role", label: "Role", sortable: true, sortField: "role" },
  {
    id: "department",
    label: "Department",
    sortable: true,
    sortField: "department",
  },
];

export function EmployeesTable({
  rows,
  loading,
  sort,
  onSortChange,
}: EmployeesTableProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {COLUMNS.map((column) => {
                const matchedSort: SortState | null =
                  column.sortable &&
                  column.sortField &&
                  sort &&
                  sort.field === column.sortField
                    ? sort
                    : null;
                const sortableField = column.sortField;
                return (
                  <TableCell
                    key={column.id}
                    sortDirection={matchedSort?.order ?? false}
                    sx={{ width: column.width, fontWeight: 600 }}
                  >
                    {column.sortable && sortableField ? (
                      <TableSortLabel
                        active={matchedSort !== null}
                        direction={matchedSort?.order ?? "asc"}
                        onClick={() => onSortChange(sortableField)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && !loading ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMNS.length}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography color="text.secondary">
                    No employees found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.role}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.department}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {loading ? (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(1px)",
            pointerEvents: "none",
          }}
        >
          <CircularProgress size={32} />
        </Box>
      ) : null}
    </Box>
  );
}
