import { externalHttp } from "@/lib/api-client";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
};

const TOKEN_KEY = "auth_token";
const COOKIE_NAME = "token";

export async function login(payload: LoginPayload) {
  const data = await externalHttp.post<LoginResponse>("/auth/login", payload);
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    // Cookie untuk middleware
    document.cookie = `${COOKIE_NAME}=${data.accessToken}; path=/; max-age=${
      60 * 60 * 24
    }; samesite=lax`;
  }
  return data;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    // Hapus cookie
    document.cookie = `${COOKIE_NAME}=; Max-Age=0; path=/; samesite=lax`;
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function isAuthenticated() {
  return !!getToken();
}
