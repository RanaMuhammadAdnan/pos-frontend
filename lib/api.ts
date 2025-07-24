export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiClient {
  private static getBaseUrl(): string {
    // Handle different environments
    if (typeof window !== 'undefined') {
      // Client-side: use relative URL
      return '/api';
    } else {
      // Server-side: use absolute URL with localhost
      return 'http://localhost:3000/api';
    }
  }

  private static authToken: string | null = null;

  private static async login(): Promise<string | null> {
    try {
      // Ensure we have a proper URL
      const loginUrl = `${this.getBaseUrl()}/auth/login`;
      
      const response = await fetch(loginUrl, {
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
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Login failed with status:', response.status, errorData);
        return null;
      }
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
      const url = `${this.getBaseUrl()}${endpoint}`;
      
      const response = await fetch(url, {
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
      console.error('API GET error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  static async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${this.getBaseUrl()}${endpoint}`;
      
      const response = await fetch(url, {
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
      console.error('API POST error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  static async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${this.getBaseUrl()}${endpoint}`;
      
      const response = await fetch(url, {
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
      console.error('API PUT error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  static async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${this.getBaseUrl()}${endpoint}`;
      
      const response = await fetch(url, {
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
      console.error('API PATCH error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${this.getBaseUrl()}${endpoint}`;
      
      const response = await fetch(url, {
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

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API DELETE error:', error);
      return { success: false, error: 'Network error' };
    }
  }
} 