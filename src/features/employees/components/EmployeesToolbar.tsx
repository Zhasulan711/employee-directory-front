import { memo } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Stack, Typography } from "@mui/material";

interface EmployeesToolbarProps {
  total: number;
  activeFiltersCount: number;
  onOpenFilters: () => void;
}

function EmployeesToolbarComponent({
  total,
  activeFiltersCount,
  onOpenFilters,
}: EmployeesToolbarProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ px: 3, py: 2 }}
    >
      <Box>
        <Typography variant="h6" component="h2">
          Employees
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Records found: {total}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FilterListIcon />}
        onClick={onOpenFilters}
      >
        Filters
        {activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}
      </Button>
    </Stack>
  );
}

export const EmployeesToolbar = memo(EmployeesToolbarComponent);
