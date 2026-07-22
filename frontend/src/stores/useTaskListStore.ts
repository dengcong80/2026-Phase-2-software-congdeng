import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  category: string;
  difficulty: string;
  latitude: number;
  longitude: number;
  addedAt: string;
}

interface TaskListState {
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'addedAt'>) => void;
  removeTask: (id: string) => void;
  isInTaskList: (id: string) => boolean;
  clearTasks: () => void;
}

// Map of old string IDs to new GUIDs
const LEGACY_ID_MAP: Record<string, string> = {
  'explore-1': 'de000000-0000-0000-0000-000000000001',
  'explore-2': 'de000000-0000-0000-0000-000000000002',
  'explore-3': 'de000000-0000-0000-0000-000000000003',
  'explore-4': 'de000000-0000-0000-0000-000000000004',
  'explore-5': 'de000000-0000-0000-0000-000000000005',
  'nature-1': 'da000000-0000-0000-0000-000000000001',
  'nature-2': 'da000000-0000-0000-0000-000000000002',
  'nature-3': 'da000000-0000-0000-0000-000000000003',
  'nature-4': 'da000000-0000-0000-0000-000000000004',
  'nature-5': 'da000000-0000-0000-0000-000000000005',
  'culture-1': 'dc000000-0000-0000-0000-000000000001',
  'culture-2': 'dc000000-0000-0000-0000-000000000002',
  'culture-3': 'dc000000-0000-0000-0000-000000000003',
  'culture-4': 'dc000000-0000-0000-0000-000000000004',
  'culture-5': 'dc000000-0000-0000-0000-000000000005',
  'food-1': 'df000000-0000-0000-0000-000000000001',
  'food-2': 'df000000-0000-0000-0000-000000000002',
  'food-3': 'df000000-0000-0000-0000-000000000003',
  'food-4': 'df000000-0000-0000-0000-000000000004',
  'food-5': 'df000000-0000-0000-0000-000000000005',
  'uni-1': 'db000000-0000-0000-0000-000000000001',
  'uni-2': 'db000000-0000-0000-0000-000000000002',
  'uni-3': 'db000000-0000-0000-0000-000000000003',
  'uni-4': 'db000000-0000-0000-0000-000000000004',
  'uni-5': 'db000000-0000-0000-0000-000000000005',
  'community-1': 'dd000000-0000-0000-0000-000000000001',
  'community-2': 'dd000000-0000-0000-0000-000000000002',
  'community-3': 'dd000000-0000-0000-0000-000000000003',
  'community-4': 'dd000000-0000-0000-0000-000000000004',
  'community-5': 'dd000000-0000-0000-0000-000000000005',
};

export const useTaskListStore = create<TaskListState>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (task) => {
        const existing = get().tasks.find((t) => t.id === task.id);
        if (existing) return;
        
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              addedAt: new Date().toISOString(),
            },
          ],
        }));
      },
      
      removeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },
      
      isInTaskList: (id) => {
        return get().tasks.some((t) => t.id === id);
      },
      
      clearTasks: () => {
        set({ tasks: [] });
      },
    }),
    {
      name: 'task-list-storage',
      version: 2,
      migrate: (persistedState, version) => {
        const state = persistedState as TaskListState;
        if (version < 2) {
          // Remap old string IDs to new GUIDs
          return {
            ...state,
            tasks: (state.tasks ?? []).map((task) => ({
              ...task,
              id: LEGACY_ID_MAP[task.id] ?? task.id,
            })),
          };
        }
        return state;
      },
    }
  )
);
