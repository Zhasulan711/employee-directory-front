import { useEffect, useState } from "react";
import { fetchEmployees } from "../api/employeesApi";
import type { EmployeesQuery, EmployeesResponse } from "../types/employee";

interface UseEmployeesResult {
  data: EmployeesResponse;
  loading: boolean;
  error: Error | null;
}

const EMPTY_RESPONSE: EmployeesResponse = { items: [], total: 0 };

export function useEmployees(query: EmployeesQuery): UseEmployeesResult {
  const [data, setData] = useState<EmployeesResponse>(EMPTY_RESPONSE);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchEmployees(query)
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("Failed to load employees"),
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  return { data, loading, error };
}
