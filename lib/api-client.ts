/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiErrorData = {
  message: string;
  code?: string;
  details?: unknown;
};

export class ApiError extends Error {
  status: number;
  data?: ApiErrorData;

  constructor(message: string, status: number, data?: ApiErrorData) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Client factory: pilih baseUrl per service
function createHttpClient(baseUrl: string = "") {
  async function request<T>(path: string, init: RequestInit = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    };

    const normalizedBase = baseUrl.replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    const res = await fetch(`${normalizedBase}${normalizedPath}`, {
      ...init,
      headers,
    });

    let json: any = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      json = await res.json();
    } else {
      const text = await res.text();
      json = text ? { message: text } : null;
    }

    if (!res.ok) {
      const msg = (json && json.message) || `Request failed: ${res.status}`;
      throw new ApiError(msg, res.status, json ?? undefined);
    }
    return json as T;
  }

  return {
    get<T>(path: string, init?: RequestInit) {
      return request<T>(path, { ...init, method: "GET" });
    },
    post<T>(path: string, body?: unknown, init?: RequestInit) {
      return request<T>(path, {
        ...init,
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      });
    },
    put<T>(path: string, body?: unknown, init?: RequestInit) {
      return request<T>(path, {
        ...init,
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
      });
    },
    delete<T>(path: string, init?: RequestInit) {
      return request<T>(path, { ...init, method: "DELETE" });
    },
  };
}

// http untuk API internal Next.js (tanpa baseUrl)
export const http = createHttpClient("");

// externalHttp untuk API eksternal (DummyJSON by default)
export const externalHttp = createHttpClient(
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://dummyjson.com"
);

export { createHttpClient };
