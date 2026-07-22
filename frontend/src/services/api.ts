import axios, { type AxiosRequestConfig } from 'axios';
import type { AuthResponse, CompleteQuestResponse, CreateQuestRequest, LeaderboardEntryResponse, QuestResponse, CommentResponse } from '../types';

type ApiEnvelope<T> = {
  success: boolean;
  message?: string | null;
  data: T | null;
};

const authStorageKey = 'auth-storage';

function readToken(): string | null {
  try {
    const raw = localStorage.getItem(authStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

const client = axios.create({
  baseURL: `${(import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000').replace(/\/$/, '')}/api`,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers.set?.('Authorization', `Bearer ${token}`);
  }
  return config;
});

export async function apiRequest<T>(path: string, options: AxiosRequestConfig = {}): Promise<T> {
  const response = await client.request<ApiEnvelope<T>>({
    url: path,
    ...options,
  });

  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Request failed');
  }

  return (response.data.data ?? null) as T;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'post',
    data: { email, password },
  });
}

export async function register(username: string, email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'post',
    data: { username, email, password },
  });
}

export async function getQuests(): Promise<QuestResponse[]> {
  return apiRequest<QuestResponse[]>('/quests');
}

export async function getQuestById(id: string): Promise<QuestResponse> {
  return apiRequest<QuestResponse>(`/quests/${id}`);
}

export async function createQuest(payload: CreateQuestRequest): Promise<QuestResponse> {
  return apiRequest<QuestResponse>('/quests', {
    method: 'post',
    data: payload,
  });
}

export async function completeQuest(id: string): Promise<CompleteQuestResponse> {
  return apiRequest<CompleteQuestResponse>(`/quests/${id}/complete`, {
    method: 'post',
  });
}

export async function toggleLike(id: string): Promise<number> {
  return apiRequest<number>(`/quests/${id}/like`, {
    method: 'post',
  });
}

export async function getLeaderboard(top = 20): Promise<LeaderboardEntryResponse[]> {
  return apiRequest<LeaderboardEntryResponse[]>(`/leaderboard?top=${top}`);
}

export async function getQuestComments(id: string): Promise<CommentResponse[]> {
  return apiRequest<CommentResponse[]>(`/quests/${id}/comments`);
}

export async function createQuestComment(id: string, text: string): Promise<CommentResponse> {
  return apiRequest<CommentResponse>(`/quests/${id}/comments`, {
    method: 'post',
    data: { text },
  });
}

export async function toggleCommentLike(commentId: string): Promise<number> {
  return apiRequest<number>(`/quests/comments/${commentId}/like`, {
    method: 'post',
  });
}
