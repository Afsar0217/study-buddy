import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API base configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Only redirect to auth if it's a token-related 401 (not login errors)
    // Login errors (invalid email/password) should not cause redirects
    if (error.response?.status === 401 && 
        error.config?.url?.includes('/auth/login') === false &&
        localStorage.getItem('authToken')) {
      // Token expired or invalid for authenticated requests
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  university?: string;
  major?: string;
  year?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  university?: string;
}

export interface StudyBuddy {
  id: string;
  name: string;
  university: string;
  major: string;
  year: string;
  bio: string;
  avatar: string;
  location: string;
  subjects: string[];
  studyTimes: Array<{
    day: string;
    time: string;
  }>;
  distance?: string;
}

export interface Match {
  id: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'unmatched';
  matched_at: string;
  other_user_id: string;
  name: string;
  avatar: string;
  major: string;
  year: string;
  university: string;
  conversationId?: string;
  lastMessageAt?: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  last_message_at: string;
  other_user_id: string;
  name: string;
  avatar: string;
  major: string;
  year: string;
  university: string;
  lastMessage?: {
    content: string;
    sender_id: string;
    created_at: string;
    message_type: string;
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  message_type: string;
  file_url?: string;
  created_at: string;
  read_at?: string;
  sender_name: string;
  sender_avatar: string;
  isMe: boolean;
}

export interface StudySession {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  session_type: 'in-person' | 'virtual';
  location?: string;
  virtual_link?: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  created_by: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  created_at: string;
  creator_name?: string;
  creator_avatar?: string;
  participation_status?: string;
  participantCount?: number;
}

export interface CreateSessionData {
  title: string;
  description?: string;
  subject?: string;
  sessionType: 'in-person' | 'virtual';
  location?: string;
  virtualLink?: string;
  startTime: string;
  endTime: string;
  maxParticipants?: number;
}

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (updates: Partial<User>): Promise<{ user: User }> => {
    const response = await api.put('/auth/profile', updates);
    return response.data;
  },

  uploadAvatar: async (formData: FormData): Promise<{ avatar: string; user: User }> => {
    const response = await api.post('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async (): Promise<{ user: User & { subjects: any[]; studyTimes: any[]; preferences: any } }> => {
    const response = await api.get('/users/me/profile');
    return response.data;
  },

  updateSubjects: async (subjects: Array<{ subject: string; proficiency_level: string }>): Promise<{ subjects: any[] }> => {
    const response = await api.put('/users/me/subjects', { subjects });
    return response.data;
  },

  updateStudyTimes: async (studyTimes: Array<{ day_of_week: string; start_time: string; end_time: string }>): Promise<{ studyTimes: any[] }> => {
    const response = await api.put('/users/me/study-times', { studyTimes });
    return response.data;
  },

  updatePreferences: async (preferences: Record<string, string>): Promise<{ preferences: Record<string, string> }> => {
    const response = await api.put('/users/me/preferences', { preferences });
    return response.data;
  },

  updateAvatar: async (avatarUrl: string): Promise<{ avatar: string }> => {
    const response = await api.post('/users/me/avatar', { avatarUrl });
    return response.data;
  },

  searchUsers: async (filters: {
    major?: string;
    year?: string;
    subject?: string;
    location?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ users: StudyBuddy[]; pagination: any }> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
    
    const response = await api.get(`/users/search?${params.toString()}`);
    return response.data;
  },

  getStats: async (): Promise<{ stats: any }> => {
    const response = await api.get('/users/me/stats');
    return response.data;
  },
};

// Matches API
export const matchesAPI = {
  getPotentialBuddies: async (filters: {
    major?: string;
    year?: string;
    subject?: string;
    location?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ potentialBuddies: StudyBuddy[]; pagination: any }> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
    
    const response = await api.get(`/matches/potential-buddies?${params.toString()}`);
    return response.data;
  },

  swipe: async (targetUserId: string, action: 'like' | 'dislike'): Promise<{ isMatch: boolean; match?: any }> => {
    const response = await api.post('/matches/swipe', { targetUserId, action });
    return response.data;
  },

  getMyMatches: async (): Promise<{ matches: Match[] }> => {
    const response = await api.get('/matches/my-matches');
    return response.data;
  },

  getPendingMatches: async (): Promise<{ pendingMatches: any[] }> => {
    const response = await api.get('/matches/pending-matches');
    return response.data;
  },

  respondToMatch: async (matchId: string, response: 'accept' | 'reject'): Promise<{ isMatch: boolean; match?: any }> => {
    const response_data = await api.post('/matches/respond-to-match', { matchId, response });
    return response_data.data;
  },

  unmatch: async (otherUserId: string): Promise<{ message: string }> => {
    const response = await api.post('/matches/unmatch', { otherUserId });
    return response.data;
  },

  getStats: async (): Promise<{ stats: any }> => {
    const response = await api.get('/matches/stats');
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  getConversations: async (): Promise<{ conversations: Conversation[] }> => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  getMessages: async (conversationId: string): Promise<{ messages: Message[] }> => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (conversationId: string, content: string, messageType: string = 'text', fileUrl?: string): Promise<{ message: Message }> => {
    const response = await api.post(`/chat/conversations/${conversationId}/messages`, {
      content,
      messageType,
      fileUrl,
    });
    return response.data;
  },

  createConversation: async (otherUserId: string): Promise<{ conversation: any }> => {
    const response = await api.post('/chat/conversations', { otherUserId });
    return response.data;
  },

  deleteConversation: async (conversationId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  markAsRead: async (conversationId: string): Promise<{ message: string }> => {
    const response = await api.put(`/chat/conversations/${conversationId}/read`);
    return response.data;
  },

  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    const response = await api.get('/chat/unread-count');
    return response.data;
  },

  searchMessages: async (query: string, conversationId?: string): Promise<{ results: Message[] }> => {
    const params = new URLSearchParams({ query });
    if (conversationId) params.append('conversationId', conversationId);
    
    const response = await api.get(`/chat/search?${params.toString()}`);
    return response.data;
  },

  getStats: async (): Promise<{ stats: any }> => {
    const response = await api.get('/chat/stats');
    return response.data;
  },
};

// Schedule API
export const scheduleAPI = {
  createSession: async (sessionData: CreateSessionData): Promise<{ session: StudySession }> => {
    console.log('API createSession called with:', sessionData);
    try {
      const response = await api.post('/schedule/sessions', sessionData);
      console.log('API createSession response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API createSession error:', error.response?.data || error.message);
      throw error;
    }
  },

  getSessions: async (filters?: { status?: string; type?: string }): Promise<{ sessions: StudySession[] }> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    
    const response = await api.get(`/schedule/sessions?${params.toString()}`);
    return response.data;
  },

  getSession: async (sessionId: string): Promise<{ session: StudySession & { participants: any[]; currentUserParticipation: any } }> => {
    const response = await api.get(`/schedule/sessions/${sessionId}`);
    return response.data;
  },

  updateSession: async (sessionId: string, updates: Partial<CreateSessionData>): Promise<{ session: StudySession }> => {
    const response = await api.put(`/schedule/sessions/${sessionId}`, updates);
    return response.data;
  },

  joinSession: async (sessionId: string): Promise<{ message: string }> => {
    const response = await api.post(`/schedule/sessions/${sessionId}/join`);
    return response.data;
  },

  leaveSession: async (sessionId: string): Promise<{ message: string }> => {
    const response = await api.post(`/schedule/sessions/${sessionId}/leave`);
    return response.data;
  },

  cancelSession: async (sessionId: string): Promise<{ message: string }> => {
    const response = await api.post(`/schedule/sessions/${sessionId}/cancel`);
    return response.data;
  },

  rateSession: async (sessionId: string, ratedUserId: string, rating: number, feedback?: string): Promise<{ message: string }> => {
    const response = await api.post(`/schedule/sessions/${sessionId}/rate`, {
      ratedUserId,
      rating,
      feedback,
    });
    return response.data;
  },

  getStats: async (): Promise<{ stats: any }> => {
    const response = await api.get('/schedule/stats');
    return response.data;
  },
};

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export default api;
