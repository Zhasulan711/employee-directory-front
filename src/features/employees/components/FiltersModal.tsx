import { useEffect, useState } from "react";
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

export function FiltersModal({
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

  const handleRoleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;
    setRole(value === ROLE_NONE_VALUE ? null : (value as Role));
  };

  const handleDepartmentsChange = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value;
    if (Array.isArray(value)) {
      setDepartments(value as Department[]);
    } else if (typeof value === "string") {
      setDepartments(value === "" ? [] : (value.split(",") as Department[]));
    }
  };

  const handleApply = () => {
    onApply({ search: search.trim(), role, departments });
  };

  const handleReset = () => {
    setSearch("");
    setRole(null);
    setDepartments([]);
    onReset();
  };

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
            onChange={(event) => setSearch(event.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Role"
            value={role ?? ROLE_NONE_VALUE}
            onChange={handleRoleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            SelectProps={{ displayEmpty: true }}
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
            InputLabelProps={{ shrink: true }}
            SelectProps={{
              multiple: true,
              onChange: handleDepartmentsChange,
              renderValue: (selected) => {
                const list = selected as Department[];
                return list.length === 0 ? "All departments" : list.join(", ");
              },
              displayEmpty: true,
            }}
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
