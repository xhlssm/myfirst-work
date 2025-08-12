'use client';
import { useStore, Thread } from '@/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MessageCircle, ThumbsUp, ThumbsDown, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { isImageUrl } from '@/lib/utils';
import Image from 'next/image';

interface ThreadCardProps {
    thread: Thread;
}

export default function ThreadCard({ thread }: ThreadCardProps) {
    const { users, setView } = useStore();
    const author = users.find(u => u.id === thread.authorId);

    const hasImage = isImageUrl(thread.content);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                className="bg-transparent backdrop-blur-md border-[#2B2B4A] shadow-lg cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                onClick={() => setView('forum', thread.id)}
            >
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-[#2B2B4A]">
                    <div className="flex items-center space-x-3">
                        <Image src={author?.avatarUrl || '/avatars/default.png'} alt={author?.username || '未知'} width={40} height={40} className="rounded-full" />
                        <div>
                            <h4 className="font-bold text-white">{thread.title}</h4>
                            <p className="text-sm text-[#B0B0CC] flex items-center space-x-2">
                                <span>{author?.username || '未知用户'}</span>
                                <Badge className="bg-[#2B2B4A] text-[#B0B0CC]">{author?.title}</Badge>
                                {thread.type === 'mission' && <Badge className="bg-red-600 text-white">任务</Badge>}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center text-[#B0B0CC] text-sm space-x-4">
                        <span className="flex items-center space-x-1">
                            <Clock size={16} />
                            <span>{formatDistanceToNow(new Date(thread.timestamp), { addSuffix: true, locale: {
                                formatDistance: (token, count) => {
                                    if (token === 'xSeconds') return '几秒前';
                                    if (token === 'xMinutes') return `${count}分钟前`;
                                    if (token === 'xHours') return `${count}小时前`;
                                    if (token === 'xDays') return `${count}天前`;
                                    if (token === 'xWeeks') return `${count}周前`;
                                    if (token === 'xMonths') return `${count}月前`;
                                    if (token === 'xYears') return `${count}年前`;
                                    return '';
                                }
                            } })}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <MessageCircle size={16} />
                            <span>{thread.replies.length}</span>
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <p className="text-[#B0B0CC] line-clamp-2">
                        {thread.content.length > 200 ? `${thread.content.substring(0, 200)}...` : thread.content}
                    </p>
                    {hasImage && (
                        <div className="relative w-full h-48 rounded-md overflow-hidden">
                            <Image src={thread.content} alt="Thread image" layout="fill" objectFit="cover" />
                        </div>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-[#B0B0CC]">
                        <span className="flex items-center space-x-1">
                            <ThumbsUp size={16} className="text-green-500" />
                            <span>{thread.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <ThumbsDown size={16} className="text-red-500" />
                            <span>{thread.dislikes}</span>
                        </span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
