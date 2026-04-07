const BASE_URL = 'http://localhost:5001/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const mergedHeaders = {
    ...headers,
    ...(options.headers as Record<string, string> || {})
  };

  const config: RequestInit = {
    ...options,
    headers: mergedHeaders,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
};

// Format a date string from YYYY-MM-DD to YYYY/MM/DD
export const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '';
  return dateStr.replace(/-/g, '/');
};
