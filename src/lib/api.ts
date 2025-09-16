type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function apiRequest<T = any>(
  endpoint: string,
  method: RequestMethod = 'GET',
  data?: any
): Promise<{ data?: T; error?: string }> {
  const url = `/api${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include', // Important pour les cookies de session
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      return { error: responseData.error || 'An error occurred' };
    }

    return { data: responseData };
  } catch (error) {
    console.error('API request failed:', error);
    return { error: 'Network error occurred' };
  }
}

// Auth API helpers
export const auth = {
  signup: (username: string, password: string) =>
    apiRequest<{ userId: string }>('/auth/signup', 'POST', { username, password }),
    
  login: (username: string, password: string) =>
    apiRequest<{ userId: string }>('/auth/login', 'POST', { username, password }),
    
  logout: () => apiRequest('/auth/logout', 'POST'),
  
  getSession: () => apiRequest<{ user: { id: string; username: string } | null }>('/auth/me'),
};
