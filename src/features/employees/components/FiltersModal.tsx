import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { SelectChangeEvent } from "@mui/material";
import { DEPARTMENTS, ROLES } from "../constants/employees";
import type { Department, EmployeeFilters, Role } from "../types/employee";

interface FiltersModalProps {
  open: boolean;
  initialFilters: EmployeeFilters;
  onClose: () => void;
  onApply: (filters: EmployeeFilters) => void;
  onReset: () => void;
}

const ROLE_NONE_VALUE = "";

const SHRINK_LABEL_PROPS = { shrink: true } as const;

function renderDepartmentsValue(selected: unknown): string {
  const list = selected as Department[];
  return list.length === 0 ? "All departments" : list.join(", ");
}

function FiltersModalComponent({
  open,
  initialFilters,
  onClose,
  onApply,
  onReset,
}: FiltersModalProps) {
  const [search, setSearch] = useState<string>(initialFilters.search);
  const [role, setRole] = useState<Role | null>(initialFilters.role);
  const [departments, setDepartments] = useState<Department[]>(
    initialFilters.departments,
  );

  useEffect(() => {
    if (open) {
      setSearch(initialFilters.search);
      setRole(initialFilters.role);
      setDepartments(initialFilters.departments);
    }
  }, [open, initialFilters]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearch(event.target.value);
    },
    [],
  );

  const handleRoleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setRole(value === ROLE_NONE_VALUE ? null : (value as Role));
    },
    [],
  );

  const handleDepartmentsChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const value = event.target.value;
      if (Array.isArray(value)) {
        setDepartments(value as Department[]);
      } else if (typeof value === "string") {
        setDepartments(value === "" ? [] : (value.split(",") as Department[]));
      }
    },
    [],
  );

  const handleApply = useCallback(() => {
    onApply({ search: search.trim(), role, departments });
  }, [onApply, search, role, departments]);

  const handleReset = useCallback(() => {
    setSearch("");
    setRole(null);
    setDepartments([]);
    onReset();
  }, [onReset]);

  const departmentsSelectProps = useMemo(
    () => ({
      multiple: true as const,
      onChange: handleDepartmentsChange,
      renderValue: renderDepartmentsValue,
      displayEmpty: true,
    }),
    [handleDepartmentsChange],
  );

  const roleSelectProps = useMemo(() => ({ displayEmpty: true }), []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        Filters
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <TextField
            label="Search across all columns"
            placeholder="ID, name, email, role, department"
            value={search}
            onChange={handleSearchChange}
            fullWidth
            InputLabelProps={SHRINK_LABEL_PROPS}
          />
          <TextField
            select
            label="Role"
            value={role ?? ROLE_NONE_VALUE}
            onChange={handleRoleChange}
            fullWidth
            InputLabelProps={SHRINK_LABEL_PROPS}
            SelectProps={roleSelectProps}
          >
            <MenuItem value={ROLE_NONE_VALUE}>
              <em>Any role</em>
            </MenuItem>
            {ROLES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Department"
            value={departments}
            fullWidth
            InputLabelProps={SHRINK_LABEL_PROPS}
            SelectProps={departmentsSelectProps}
          >
            {DEPARTMENTS.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={departments.includes(option)} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="error" onClick={handleReset}>
          Reset
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleApply}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const FiltersModal = memo(FiltersModalComponent);
