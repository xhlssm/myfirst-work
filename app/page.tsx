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
    <div className="bg-black text-white h-screen overflow-hidden">
      <Header />
      <NotificationPopup />
      <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 64px)" }}>
        {renderContent()}
      </div>
    </div>
  );
}
