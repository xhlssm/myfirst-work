"use client";
import { useStore, Faction as FactionType } from "@/store";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
const Forum = dynamic(() => import("@/components/Forum/Forum"), { ssr: false });
const Leaderboard = dynamic(() => import("@/components/Leaderboard"));
const Factions = dynamic(() => import("@/components/Factions"));
const FactionPage = dynamic(() => import("@/components/FactionPage"));
const UserProfile = dynamic(() => import("@/components/UserProfile"));
const Shop = dynamic(() => import("@/components/Shop"));
const Achievements = dynamic(() => import("@/components/Achievements"));
const AdminPanel = dynamic(() => import("@/components/AdminPanel"));
const Messages = dynamic(() => import("@/components/Message"));
import NotificationPopup from "@/components/NotificationPopup";

export default function App() {
  const { activeView, selectedUsername } = useStore();

  const renderContent = () => {
    switch (activeView) {
      case "forum":
        return <Forum />;
      case "leaderboard":
        return <Leaderboard />;
      case "factions":
        return <Factions />;
      case "faction_page":
        return <FactionPage factionId={(selectedUsername as FactionType | null) ?? null} />;
      case "profile":
        return typeof selectedUsername === "string" ? (
          <UserProfile username={selectedUsername} />
        ) : null;
      case "shop":
        return <Shop />;
      case "achievements":
        return <Achievements />;
      case "messages":
        return <Messages />;
      case "admin":
        return <AdminPanel />;
      default:
        return <Forum />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* 动态背景装饰 */}
      <div className="fixed inset-0 bg-gradient-radial opacity-30"></div>
      
      {/* 浮动光点 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-pink-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
      </div>
      
      <Header />
      <NotificationPopup />
      
      <main className="relative z-10 p-4 pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
