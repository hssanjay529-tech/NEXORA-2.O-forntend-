// =============================================================================
// NEXORA — Unified API Client & Service Registry
// Strictly maps to FastAPI backend routes defined in api_spec.md
// =============================================================================

/**
 * Dynamically resolves the API BASE_URL:
 * 1. Priority 1: Next.js process.env.NEXT_PUBLIC_API_URL
 * 2. Priority 2: Vite import.meta.env.VITE_API_URL
 * 3. Default: http://localhost:8000 (FastAPI backend)
 * 
 * Strict Guard: Prevents accidental self-calling of frontend ports (e.g. 3000 or 5173).
 */
export const resolveApiBaseUrl = (): string => {
  let resolvedUrl: string | undefined;

  // 1. Next.js convention: process.env.NEXT_PUBLIC_API_URL
  const nodeEnv = typeof globalThis !== 'undefined' ? (globalThis as any).process?.env : undefined;
  if (nodeEnv && nodeEnv.NEXT_PUBLIC_API_URL) {
    resolvedUrl = nodeEnv.NEXT_PUBLIC_API_URL;
  }
  // 2. Vite convention fallback: import.meta.env.VITE_API_URL
  else if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_URL) {
    resolvedUrl = (import.meta as any).env.VITE_API_URL;
  }

  let finalUrl = (resolvedUrl || 'http://localhost:8000').trim().replace(/\/+$/, '');

  // Guard: Never allow API calls to point to frontend ports (3000 or 5173)
  if (finalUrl.includes(':3000') || finalUrl.includes(':5173')) {
    console.error(
      `[API CLIENT ERROR] BASE_URL (${finalUrl}) was configured to the frontend port! Strictly redirecting to FastAPI backend: http://localhost:8000`
    );
    finalUrl = 'http://localhost:8000';
  }

  return finalUrl;
};

export const BASE_URL = resolveApiBaseUrl();

export interface ApiRequestOptions extends RequestInit {
  tenantId?: string;
  token?: string;
}

class ApiClient {
  private token: string | null = (typeof window !== 'undefined' ? sessionStorage.getItem('nexora_auth_token') : null);
  private tenantId: string = '11111111-1111-1111-1111-111111111111';

  setAuthToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem('nexora_auth_token', token);
      } else {
        sessionStorage.removeItem('nexora_auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Tenant-ID': options.tenantId || this.tenantId,
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token || options.token) {
      headers['Authorization'] = `Bearer ${options.token || this.token}`;
    }

    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/logout')) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('nexora_session_expired'));
        }
      }
      let errorMessage = `API Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          errorMessage = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
        }
      } catch {
        // Fallback to response status text
      }
      throw new Error(errorMessage);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(endpoint: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
