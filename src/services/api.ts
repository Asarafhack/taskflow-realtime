const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('taskflow-token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
};

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; name: string; email: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (name: string, email: string, password: string) =>
      request<{ token: string; user: { id: string; name: string; email: string } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
  },

  boards: {
    getAll: () => request<any[]>('/boards'),
    create: (title: string) => request<any>('/boards', { method: 'POST', body: JSON.stringify({ title }) }),
    addMember: (boardId: string, email: string) =>
      request<any>(`/boards/${boardId}/add-member`, { method: 'POST', body: JSON.stringify({ email }) }),
  },

  lists: {
    create: (title: string, boardId: string) =>
      request<any>('/lists', { method: 'POST', body: JSON.stringify({ title, boardId }) }),
  },

  tasks: {
    getByBoard: (boardId: string, filters?: { priority?: string; assignedTo?: string; completed?: string; page?: number; limit?: number }) => {
      const params = new URLSearchParams();
      if (filters?.priority) params.set('priority', filters.priority);
      if (filters?.assignedTo) params.set('assignedTo', filters.assignedTo);
      if (filters?.completed) params.set('completed', filters.completed);
      if (filters?.page) params.set('page', String(filters.page));
      if (filters?.limit) params.set('limit', String(filters.limit));
      const qs = params.toString();
      return request<any[]>(`/tasks?boardId=${boardId}${qs ? `&${qs}` : ''}`);
    },
    create: (data: { title: string; listId: string }) =>
      request<any>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/tasks/${id}`, { method: 'DELETE' }),
    assign: (id: string, userId: string) =>
      request<any>(`/tasks/${id}/assign`, { method: 'POST', body: JSON.stringify({ userId }) }),
    search: (q: string) => request<any[]>(`/tasks/search?q=${encodeURIComponent(q)}`),
    completed: (date: string) => request<any[]>(`/tasks/completed?date=${date}`),
  },

  activity: {
    getByBoard: (boardId: string) => request<any[]>(`/activity?boardId=${boardId}`),
  },
};
