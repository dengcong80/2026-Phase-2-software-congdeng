export interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data: T | null;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  totalXp: number;
}

export interface QuestResponse {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  rewardXp: number;
  status: string;
  likesCount: number;
  completedByMe: boolean;
  likedByMe: boolean;
  createdAt: string;
}

export interface CommentResponse {
  id: string;
  username: string;
  text: string;
  likesCount: number;
  likedByMe: boolean;
  createdAt: string;
}

export interface CreateQuestRequest {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  rewardXp: number;
}

export interface CompleteQuestResponse {
  earnedXp: number;
  totalXp: number;
  newBadges: string[];
}

export interface LeaderboardEntryResponse {
  rank: number;
  username: string;
  totalXp: number;
  questsCompleted: number;
}

export interface LocationState {
  lat: number;
  lng: number;
  accuracy: number;
}

export interface ShareItem {
  id: string;
  questId: string;
  questTitle: string;
  username: string;
  note: string;
  imagePreview?: string;
  likes: number;
  createdAt: string;
}
