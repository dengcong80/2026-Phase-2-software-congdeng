import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { QuestDetail } from './pages/QuestDetail';
import { CreateQuestPage } from './pages/CreateQuestPage';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { ExplorePage } from './pages/ExplorePage';
import { CommunityPage } from './pages/CommunityPage';
import { DebugQuests } from './pages/DebugQuests';
import { createLeaderboardConnection } from './services/signalr';
import { useQuestStore } from './stores/useQuestStore';
import { useUserStore } from './stores/useUserStore';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  const token = useUserStore((state) => state.token);
  const setLeaderboard = useQuestStore((state) => state.setLeaderboard);
  const setOnlineCount = useQuestStore((state) => state.setOnlineCount);
  const updateQuestLikeCount = useQuestStore((state) => state.updateQuestLikeCount);

  useEffect(() => {
    if (!token) {
      return;
    }

    const connection = createLeaderboardConnection(token);
    connection.on('LeaderboardUpdated', (entries) => setLeaderboard(entries));
    connection.on('OnlineCountUpdated', (count) => setOnlineCount(count));
    connection.on('QuestLikeUpdated', (questId: string, count: number) => updateQuestLikeCount(questId, count));

    void connection.start();

    return () => {
      void connection.stop();
    };
  }, [setLeaderboard, setOnlineCount, token, updateQuestLikeCount]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
        <Route path="/quests/:id" element={<ProtectedRoute><QuestDetail /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateQuestPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/debug-quests" element={<ProtectedRoute><DebugQuests /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
