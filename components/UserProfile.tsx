'use client';

import { useStore, User } from '@/store';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageCircle, Edit2, Check, X, Users, Code, Book, Paintbrush, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FactionBadge } from '@/lib/utils';
import Image from 'next/image';

export default function UserProfile({ username }: { username: string }) {
    const { users, user: currentUser, setView, updateUser, factions, threads } = useStore();
    const [editMode, setEditMode] = useState(false);
    const [editedBio, setEditedBio] = useState('');
    const [editedAvatar, setEditedAvatar] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const profileUser = users.find(u => u.username === username);

    useEffect(() => {
        if (profileUser) {
            setEditedBio(profileUser.bio);
            setEditedAvatar(profileUser.avatarUrl);
        }
    }, [profileUser]);

    if (!isClient || !profileUser) {
        return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 text-[#B0B0CC]">用户未找到。</motion.div>;
    }

    const handleSave = () => {
        if (currentUser?.id === profileUser.id) {
            updateUser({ bio: editedBio, avatarUrl: editedAvatar });
            setEditMode(false);
        }
    };

    const isCurrentUserProfile = currentUser?.id === profileUser.id;
    const userThreads = threads.filter(t => t.authorId === profileUser.id).sort((a,b) => b.timestamp - a.timestamp);

    const renderFactionIcon = (faction: string) => {
        switch (faction) {
            case '开发组': return <Code className="w-4 h-4 text-blue-400" />;
            case '剧情组': return <Book className="w-4 h-4 text-purple-400" />;
            case '艺术组': return <Paintbrush className="w-4 h-4 text-pink-400" />;
            case '自由人': return <UserPlus className="w-4 h-4 text-green-400" />;
            default: return null;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <Card className="bg-transparent backdrop-blur-md border-[#2B2B4A] shadow-lg">
                <CardContent className="flex flex-col md:flex-row items-center md:items-start p-8 space-y-6 md:space-y-0 md:space-x-8">
                    <div className="flex-shrink-0 relative w-32 h-32">
                        <Image src={profileUser.avatarUrl} alt={profileUser.username} width={128} height={128} className="rounded-full border-4 border-[#00E4FF]" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-2">
                            <h2 className="text-3xl font-bold text-white">{profileUser.username}</h2>
                            <span className="text-xs text-[#B0B0CC] bg-[#2B2B4A] px-2 py-1 rounded-full">{profileUser.title}</span>
                            {profileUser.isAdmin && <Badge className="bg-red-600">管理员</Badge>}
                        </div>
                        <div className="flex items-center justify-center md:justify-start space-x-2 mt-2 text-yellow-400">
                            <Star size={18} />
                            <span>{profileUser.reputation} 声望</span>
                        </div>
                        {profileUser.faction && (
                            <div className="flex items-center justify-center md:justify-start space-x-2 mt-2 text-[#B0B0CC]">
                                {renderFactionIcon(profileUser.faction)}
                                <span>{profileUser.faction} 派系</span>
                            </div>
                        )}
                        <div className="mt-4 text-[#B0B0CC] space-y-2">
                            {editMode ? (
                                <>
                                    <Textarea value={editedBio} onChange={(e) => setEditedBio(e.target.value)} className="bg-[#2B2B4A] border-[#00E4FF]" />
                                    <Input value={editedAvatar} onChange={(e) => setEditedAvatar(e.target.value)} className="bg-[#2B2B4A] border-[#00E4FF]" />
                                </>
                            ) : (
                                <p>{profileUser.bio}</p>
                            )}
                        </div>
                        <div className="mt-6 flex justify-center md:justify-start space-x-4">
                            {isCurrentUserProfile && (
                                editMode ? (
                                    <>
                                        <Button onClick={handleSave} className="bg-[#00E4FF] hover:bg-[#00BFFF] text-[#1A1A2E]"><Check className="mr-2" /> 保存</Button>
                                        <Button onClick={() => setEditMode(false)} variant="secondary" className="bg-[#2B2B4A] hover:bg-[#3D3D5A] text-white"><X className="mr-2" /> 取消</Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setEditMode(true)} className="bg-[#FF00FF] hover:bg-[#FF88FF] text-[#1A1A2E]"><Edit2 className="mr-2" /> 编辑资料</Button>
                                )
                            )}
                            {currentUser && currentUser.id !== profileUser.id && (
                                <Button onClick={() => setView('messages', profileUser.username)} className="bg-[#00E4FF] hover:bg-[#00BFFF] text-[#1A1A2E]"><MessageCircle className="mr-2" /> 发送私信</Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-transparent backdrop-blur-md border-[#2B2B4A]">
                    <CardHeader>
                        <CardTitle className="text-white text-xl">已发布的帖子</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {userThreads.length > 0 ? (
                            userThreads.map(thread => (
                                <div key={thread.id} className="p-4 bg-[#2B2B4A] rounded-md transition-colors hover:bg-[#3D3D5A] cursor-pointer" onClick={() => setView('forum', thread.id)}>
                                    <h4 className="text-lg font-bold text-[#00E4FF]">{thread.title}</h4>
                                    <p className="text-sm text-[#B0B0CC] truncate">{thread.content.substring(0, 100)}...</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-[#B0B0CC]">该用户尚未发布任何内容。</p>
                        )}
                    </CardContent>
                </Card>
                <Card className="bg-transparent backdrop-blur-md border-[#2B2B4A]">
                    <CardHeader>
                        <CardTitle className="text-white text-xl">徽章</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {profileUser.badges.length > 0 ? (
                            profileUser.badges.map(badge => (
                                <Badge key={badge} className="bg-[#00E4FF]/20 text-[#00E4FF] border border-[#00E4FF]">{badge}</Badge>
                            ))
                        ) : (
                            <p className="text-[#B0B0CC]">该用户还没有获得任何徽章。</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
