import type { EmployeesQuery, EmployeesResponse } from "../types/employee";
import { apiClient } from "./client";

export async function fetchEmployees(
  query: EmployeesQuery,
): Promise<EmployeesResponse> {
  const params: Record<string, string | number> = {
    page: query.page,
    pageSize: query.pageSize,
  };

  if (query.filters.search.trim()) {
    params.search = query.filters.search.trim();
  }
  if (query.filters.role) {
    params.role = query.filters.role;
  }
  if (query.filters.departments.length > 0) {
    params.departments = query.filters.departments.join(",");
  }
  if (query.sort) {
    params.sortField = query.sort.field;
    params.sortOrder = query.sort.order;
  }

  const response = await apiClient.get<EmployeesResponse>("/employees", {
    params,
  });
  return response.data;
}
