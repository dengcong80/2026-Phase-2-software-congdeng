import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompleteQuestResponse, CreateQuestRequest, LeaderboardEntryResponse, LocationState, QuestResponse, ShareItem } from '../types';
import { completeQuest, createQuest, getLeaderboard, getQuestById, getQuests, toggleLike } from '../services/api';
import { useUserStore } from './useUserStore';

interface QuestState {
  quests: QuestResponse[];
  selectedQuest: QuestResponse | null;
  leaderboard: LeaderboardEntryResponse[];
  onlineCount: number;
  isLoading: boolean;
  error: string | null;
  location: LocationState | null;
  nearbyQuests: QuestResponse[];
  shares: ShareItem[];
  fetchQuests: () => Promise<void>;
  fetchQuestById: (id: string) => Promise<void>;
  createQuest: (payload: CreateQuestRequest) => Promise<QuestResponse>;
  completeQuest: (id: string) => Promise<CompleteQuestResponse>;
  toggleLike: (id: string) => Promise<void>;
  setLeaderboard: (entries: LeaderboardEntryResponse[]) => void;
  setOnlineCount: (count: number) => void;
  updateQuestLikeCount: (questId: string, count: number) => void;
  setLocation: (location: LocationState) => void;
  requestLocation: () => Promise<void>;
  createShare: (payload: { questId: string; questTitle: string; note: string; imagePreview?: string }) => void;
  toggleShareLike: (shareId: string) => Promise<void>;
  clearError: () => void;
}

function computeNearbyQuests(quests: QuestResponse[], location: LocationState | null) {
  if (!location) return [];

  return [...quests]
    .map((quest) => ({
      quest,
      distance: Math.hypot(quest.latitude - location.lat, quest.longitude - location.lng),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((item) => item.quest);
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      quests: [],
      selectedQuest: null,
      leaderboard: [],
      onlineCount: 0,
      isLoading: false,
      error: null,
      location: null,
      nearbyQuests: [],
      shares: [],
      fetchQuests: async () => {
        set({ isLoading: true, error: null });
        try {
          const quests = await getQuests();
          const location = get().location;
          set({ quests, nearbyQuests: computeNearbyQuests(quests, location), isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unable to load quests.', isLoading: false });
        }
      },
      fetchQuestById: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const quest = await getQuestById(id);
          set({ selectedQuest: quest, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unable to load quest.', isLoading: false });
        }
      },
      createQuest: async (payload) => {
        const quest = await createQuest(payload);
        set((state) => ({ quests: [quest, ...state.quests], nearbyQuests: computeNearbyQuests([quest, ...state.quests], state.location) }));
        return quest;
      },
      completeQuest: async (id) => {
        const response = await completeQuest(id);
        const userStore = useUserStore.getState();
        userStore.setTotalXp(response.totalXp);
        set((state) => ({
          quests: state.quests.map((quest) => (quest.id === id ? { ...quest, completedByMe: true } : quest)),
          selectedQuest: state.selectedQuest?.id === id ? { ...state.selectedQuest, completedByMe: true } : state.selectedQuest,
        }));
        return response;
      },
      toggleLike: async (id) => {
        const count = await toggleLike(id);
        set((state) => ({
          quests: state.quests.map((quest) => (quest.id === id ? { ...quest, likesCount: count, likedByMe: !quest.likedByMe } : quest)),
          selectedQuest: state.selectedQuest?.id === id ? { ...state.selectedQuest, likesCount: count, likedByMe: !state.selectedQuest.likedByMe } : state.selectedQuest,
          shares: state.shares.map((share) => (share.questId === id ? { ...share, likes: count } : share)),
        }));
      },
      setLeaderboard: (entries) => set({ leaderboard: entries }),
      setOnlineCount: (count) => set({ onlineCount: count }),
      updateQuestLikeCount: (questId, count) => {
        set((state) => ({
          quests: state.quests.map((quest) => (quest.id === questId ? { ...quest, likesCount: count } : quest)),
          selectedQuest: state.selectedQuest?.id === questId ? { ...state.selectedQuest, likesCount: count } : state.selectedQuest,
          shares: state.shares.map((share) => (share.questId === questId ? { ...share, likes: count } : share)),
        }));
      },
      setLocation: (location) => {
        set((state) => ({ location, nearbyQuests: computeNearbyQuests(state.quests, location) }));
      },
      requestLocation: async () => {
        if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
          throw new Error('Geolocation is not supported in this browser.');
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        });

        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        set((state) => ({ location, nearbyQuests: computeNearbyQuests(state.quests, location) }));
      },
      createShare: (payload) => {
        const username = useUserStore.getState().username ?? 'You';
        const share: ShareItem = {
          id: `${payload.questId}-${Date.now()}`,
          questId: payload.questId,
          questTitle: payload.questTitle,
          username,
          note: payload.note || 'A beautiful check-in from the trail.',
          imagePreview: payload.imagePreview,
          likes: 0,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ shares: [share, ...state.shares] }));
      },
      toggleShareLike: async (shareId) => {
        const share = get().shares.find((entry) => entry.id === shareId);
        if (!share) {
          return;
        }

        const count = await toggleLike(share.questId);
        set((state) => ({
          shares: state.shares.map((entry) => (entry.id === shareId ? { ...entry, likes: count } : entry)),
        }));
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: 'quest-store',
      partialize: (state) => ({ shares: state.shares, location: state.location }),
    }
  )
);

export async function refreshLeaderboard(): Promise<void> {
  const entries = await getLeaderboard(10);
  useQuestStore.getState().setLeaderboard(entries);
}
