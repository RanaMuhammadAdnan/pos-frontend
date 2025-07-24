export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiClient {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  private static authToken: string | null = null;

  private static async login(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin@123'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.token;
      }
      return null;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  private static async getAuthHeaders(): Promise<HeadersInit> {
    try {
      // If we don't have a token, try to login
      if (!this.authToken) {
        this.authToken = await this.login();
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      return headers;
    } catch (error) {
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  static async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  static async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  static async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
        };
      }

      // For DELETE requests, we might not get JSON back
      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
} 