import { memo, useMemo } from "react";
import { Button, Chip, Divider, Stack, Typography } from "@mui/material";
import type { Department, EmployeeFilters } from "../types/employee";

interface ActiveFiltersProps {
  filters: EmployeeFilters;
  onClearSearch: () => void;
  onClearRole: () => void;
  onRemoveDepartment: (department: Department) => void;
  onResetAll: () => void;
}

function ActiveFiltersComponent({
  filters,
  onClearSearch,
  onClearRole,
  onRemoveDepartment,
  onResetAll,
}: ActiveFiltersProps) {
  const trimmedSearch = useMemo(() => filters.search.trim(), [filters.search]);
  const hasSearch = trimmedSearch.length > 0;
  const hasRole = filters.role !== null;
  const hasDepartments = filters.departments.length > 0;
  const hasAny = hasSearch || hasRole || hasDepartments;

  if (!hasAny) return null;

  return (
    <>
      <Divider />
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
        sx={{ px: 3, py: 1.5, backgroundColor: "action.hover" }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Active filters:
        </Typography>
        {hasSearch ? (
          <Chip
            size="small"
            label={`Search: ${trimmedSearch}`}
            onDelete={onClearSearch}
            color="primary"
            variant="outlined"
          />
        ) : null}
        {hasRole ? (
          <Chip
            size="small"
            label={`Role: ${filters.role}`}
            onDelete={onClearRole}
            color="primary"
            variant="outlined"
          />
        ) : null}
        {filters.departments.map((department) => (
          <Chip
            key={department}
            size="small"
            label={`Department: ${department}`}
            onDelete={() => onRemoveDepartment(department)}
            color="primary"
            variant="outlined"
          />
        ))}
        <Button
          size="small"
          color="error"
          onClick={onResetAll}
          sx={{ ml: "auto" }}
        >
          Reset all filters
        </Button>
      </Stack>
    </>
  );
}

export const ActiveFilters = memo(ActiveFiltersComponent);
