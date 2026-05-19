import type {
  AxiosAdapter,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { AxiosHeaders } from "axios";
import { MOCK_LATENCY_MS } from "../constants/employees";
import type {
  Department,
  Employee,
  EmployeesResponse,
  Role,
  SortField,
  SortOrder,
} from "../types/employee";
import { generateEmployees } from "./mockData";

const dataset: Employee[] = generateEmployees();

interface MockParams {
  page?: string | number;
  pageSize?: string | number;
  search?: string;
  role?: string;
  departments?: string;
  sortField?: string;
  sortOrder?: string;
}

function applySearch(items: Employee[], search: string): Employee[] {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((employee) => {
    return (
      String(employee.id).includes(normalized) ||
      employee.firstName.toLowerCase().includes(normalized) ||
      employee.lastName.toLowerCase().includes(normalized) ||
      employee.email.toLowerCase().includes(normalized) ||
      employee.role.toLowerCase().includes(normalized) ||
      employee.department.toLowerCase().includes(normalized)
    );
  });
}

function applyRoleFilter(
  items: Employee[],
  role: string | undefined,
): Employee[] {
  if (!role) return items;
  return items.filter((employee) => employee.role === (role as Role));
}

function applyDepartmentsFilter(
  items: Employee[],
  raw: string | undefined,
): Employee[] {
  if (!raw) return items;
  const departments = raw.split(",").filter(Boolean) as Department[];
  if (departments.length === 0) return items;
  return items.filter((employee) => departments.includes(employee.department));
}

function applySort(
  items: Employee[],
  field: SortField | undefined,
  order: SortOrder | undefined,
): Employee[] {
  if (!field) return items;
  const direction = order === "desc" ? -1 : 1;
  return [...items].sort((a, b) => {
    const result = a[field].localeCompare(b[field]);
    return result === 0 ? a.id - b.id : result * direction;
  });
}

function toNumber(
  value: string | number | undefined,
  fallback: number,
): number {
  if (value === undefined) return fallback;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildResponse(params: MockParams): EmployeesResponse {
  const search = typeof params.search === "string" ? params.search : "";
  const page = toNumber(params.page, 0);
  const pageSize = toNumber(params.pageSize, 10);
  const sortField =
    params.sortField === "role" || params.sortField === "department"
      ? params.sortField
      : undefined;
  const sortOrder =
    params.sortOrder === "asc" || params.sortOrder === "desc"
      ? params.sortOrder
      : undefined;

  let result = dataset;
  result = applySearch(result, search);
  result = applyRoleFilter(result, params.role);
  result = applyDepartmentsFilter(result, params.departments);
  const total = result.length;
  result = applySort(result, sortField, sortOrder);

  const start = page * pageSize;
  const items = result.slice(start, start + pageSize);
  return { items, total };
}

function buildAxiosResponse<T>(
  data: T,
  config: InternalAxiosRequestConfig,
): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: new AxiosHeaders(),
    config,
  };
}

export const mockAdapter: AxiosAdapter = (config) => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const method = (config.method ?? "get").toLowerCase();
      const url = config.url ?? "";
      if (method === "get" && url === "/employees") {
        const params = (config.params ?? {}) as MockParams;
        resolve(buildAxiosResponse(buildResponse(params), config));
        return;
      }
      reject(
        new Error(
          `Mock backend: route not found for ${method.toUpperCase()} ${url}`,
        ),
      );
    }, MOCK_LATENCY_MS);
  });
};
