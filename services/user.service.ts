import { externalHttp } from "@/lib/api-client";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  role?: string;
};

export type UsersResponse = {
  users: User[];
  total?: number;
  skip?: number;
  limit?: number;
};

type ListParams = {
  limit?: number;
  skip?: number;
};

function toQuery(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (!entries.length) return "";
  const qs = new URLSearchParams(entries as [string, string][]).toString();
  return `?${qs}`;
}

export function listUsers(params?: ListParams) {
  return externalHttp.get<UsersResponse>(`/users${toQuery(params)}`);
}

export function getUser(id: number | string) {
  return externalHttp.get<User>(`/users/${id}`);
}

export function searchUsers(q: string, params?: Omit<ListParams, "skip">) {
  return externalHttp.get<UsersResponse>(`/users/search${toQuery({ q, ...params })}`);
}