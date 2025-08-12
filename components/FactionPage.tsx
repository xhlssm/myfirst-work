// @/components/FactionPage.tsx
'use client';
import { useStore, Faction } from '@/store';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users } from 'lucide-react';

export default function FactionPage({ factionId }: { factionId: Faction | null }) {
    const { factions, users } = useStore();
    const faction = factions.find(f => f.id === factionId);
    if (!faction) return <div className="text-center text-[#B0B0CC] p-8">派系不存在。</div>;

    const members = users.filter(u => faction.members.includes(u.id));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-[#00E4FF] flex items-center space-x-2">
                <Users size={32} /> <span>{faction.name}</span>
            </h2>
            <Card className="bg-transparent backdrop-blur-md border-[#2B2B4A]">
                <CardHeader>
                    <CardTitle className="text-white text-xl">派系数据</CardTitle>
                </CardHeader>
                <CardContent className="flex space-x-8">
                    <p className="text-[#B0B0CC] flex items-center"><Star className="mr-2 text-yellow-400" /> 声望值: {faction.reputation}</p>
                    <p className="text-[#B0B0CC] flex items-center"><Users className="mr-2" /> 成员数: {faction.members.length}</p>
                </CardContent>
            </Card>
            <Card className="bg-transparent backdrop-blur-md border-[#2B2B4A]">
                <CardHeader>
                    <CardTitle className="text-white text-xl">派系成员</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map(member => (
                            <div key={member.id} className="p-4 bg-[#24243D] rounded-md flex items-center space-x-4">
                                <img src={member.avatarUrl} alt={member.username} className="w-12 h-12 rounded-full" />
                                <span className="text-white">{member.username}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
