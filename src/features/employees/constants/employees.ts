import type { Department, EmployeeFilters, Role } from "../types/employee";

export const ROLES: readonly Role[] = [
  "Manager",
  "Developer",
  "Designer",
  "QA Engineer",
  "Product Manager",
  "HR Specialist",
  "Sales Manager",
  "Marketing Specialist",
  "Data Analyst",
  "Support Specialist",
];

export const DEPARTMENTS: readonly Department[] = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Support",
  "Legal",
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30] as const;

export const DEFAULT_PAGE_SIZE = 10;

export const MOCK_LATENCY_MS = 350;

export const EMPTY_FILTERS: EmployeeFilters = {
  search: "",
  role: null,
  departments: [],
};
