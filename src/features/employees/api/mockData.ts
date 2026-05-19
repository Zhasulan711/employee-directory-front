import { DEPARTMENTS, ROLES } from "../constants/employees";
import type { Employee } from "../types/employee";

const FIRST_NAMES = [
  "Alex",
  "Maria",
  "John",
  "Anna",
  "Michael",
  "Olivia",
  "James",
  "Emma",
  "David",
  "Sophia",
  "Daniel",
  "Isabella",
  "Matthew",
  "Mia",
  "Andrew",
  "Charlotte",
  "Joseph",
  "Amelia",
  "Christopher",
  "Harper",
  "Joshua",
  "Evelyn",
  "Anthony",
  "Abigail",
  "William",
  "Ella",
  "Ryan",
  "Avery",
  "Nicholas",
  "Scarlett",
  "Lucas",
  "Grace",
  "Henry",
  "Chloe",
  "Owen",
  "Lily",
  "Jack",
  "Hannah",
  "Benjamin",
  "Zoe",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
];

const TOTAL_EMPLOYEES = 120;

function pick<T>(list: readonly T[], index: number): T {
  return list[index % list.length] as T;
}

export function generateEmployees(): Employee[] {
  const employees: Employee[] = [];
  for (let i = 0; i < TOTAL_EMPLOYEES; i++) {
    const firstName = pick(FIRST_NAMES, i);
    const lastName = pick(LAST_NAMES, i * 7 + 3);
    const role = pick(ROLES, i * 3 + 1);
    const department = pick(DEPARTMENTS, i * 5 + 2);
    const id = i + 1;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@company.com`;
    employees.push({ id, firstName, lastName, email, role, department });
  }
  return employees;
}
