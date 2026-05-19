export type Role =
  | "Manager"
  | "Developer"
  | "Designer"
  | "QA Engineer"
  | "Product Manager"
  | "HR Specialist"
  | "Sales Manager"
  | "Marketing Specialist"
  | "Data Analyst"
  | "Support Specialist";

export type Department =
  | "Engineering"
  | "Design"
  | "Product"
  | "Marketing"
  | "Sales"
  | "HR"
  | "Finance"
  | "Operations"
  | "Support"
  | "Legal";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department: Department;
}

export type SortField = "role" | "department";
export type SortOrder = "asc" | "desc";

export interface SortState {
  field: SortField;
  order: SortOrder;
}

export interface EmployeeFilters {
  search: string;
  role: Role | null;
  departments: Department[];
}

export interface EmployeesQuery {
  page: number;
  pageSize: number;
  sort: SortState | null;
  filters: EmployeeFilters;
}

export interface EmployeesResponse {
  items: Employee[];
  total: number;
}
