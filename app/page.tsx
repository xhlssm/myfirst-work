"use client";
import { useState } from "react";
import { useStore, Faction as FactionType } from "@/store";
import Header from "@/components/Header";
import GuideSystem from "@/components/GuideSystem";
import AuthSystem from "@/components/AuthSystem";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
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
  const [showGuide, setShowGuide] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

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
      
      {/* 引导按钮 */}
      <div className="fixed top-24 right-4 z-40">
        <Button
          onClick={() => setShowGuide(true)}
          className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white hover:from-[#00E4FF]/90 hover:to-[#FF00FF]/90 btn-glow rounded-full w-12 h-12 p-0"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </div>
      
      {/* 认证系统 */}
      <div className="fixed top-24 right-20 z-40">
        <AuthSystem />
      </div>
      
      <main className="relative z-10 p-4 pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div style={{fontSize:24,color:'#00e4ff',marginBottom:16}}>主内容测试</div>
          {renderContent()}
        </div>
      </main>
      
      {/* 引导系统 */}
      <GuideSystem isVisible={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
}
