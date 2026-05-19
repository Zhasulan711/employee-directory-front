import axios from "axios";
import { mockAdapter } from "./mockBackend";

export const apiClient = axios.create({
  baseURL: "/api",
  adapter: mockAdapter,
});
