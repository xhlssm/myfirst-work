'use client';
import { useStore, Thread, Reply, MissionDetails } from '@/store';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageCircle, Clock, Check, Loader2, Play, Tag, Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { isImageUrl } from '@/lib/utils';
import Image from 'next/image';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'dompurify';
import { formatDistanceToNow } from 'date-fns';

export default function ThreadPage() {
    const { threads, users, user, setView, activeView, selectedUsername, addReply, toggleLike, toggleDislike, updateMissionSubtask, submitMissionSolution, approveMission } = useStore();
    const [replyContent, setReplyContent] = useState('');
    const [replyToId, setReplyToId] = useState<number | null>(null);
    const [missionSolution, setMissionSolution] = useState('');
    const replyRef = useRef<HTMLTextAreaElement>(null);
    
    if (activeView !== 'forum' || typeof selectedUsername !== 'number') return null;

    const thread = threads.find(t => t.id === selectedUsername);

    if (!thread) {
        return <div className="text-center p-8 text-[#B0B0CC]">帖子未找到。</div>;
    }

    const author = users.find(u => u.id === thread.authorId);

    const handleReply = () => {
        if (!user || !replyContent.trim()) return;
        addReply(thread.id, { content: replyContent, authorId: user.id }, replyToId || undefined);
        setReplyContent('');
        setReplyToId(null);
    };

    const MissionCard = ({ missionDetails }: { missionDetails: MissionDetails }) => (
        <Card className="bg-transparent backdrop-blur-md border-[#00E4FF] mt-4">
            <CardHeader className="p-4 border-b border-[#2B2B4A]">
                <CardTitle className="text-[#00E4FF] text-xl flex items-center space-x-2">
                    <Tag /><span>任务详情</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <p className="text-white flex items-center space-x-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Star /></motion.div>
                    <span className="font-bold">奖励：</span><span className="text-yellow-400">{missionDetails.reward} 声望</span>
                </p>
                <div className="space-y-2">
                    <p className="text-white font-bold">任务目标：</p>
                    <ul className="list-disc list-inside text-[#B0B0CC] space-y-1">
                        {missionDetails.subtasks.map(subtask => (
                            <li key={subtask.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={subtask.completed}
                                    onChange={() => user?.id === thread.authorId && updateMissionSubtask(thread.id, subtask.id, !subtask.completed)}
                                    className="accent-[#00E4FF] cursor-pointer"
                                    disabled={user?.id !== thread.authorId}
                                />
                                <span className={subtask.completed ? 'line-through text-[#B0B0CC]/50' : ''}>{subtask.description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {user?.id !== thread.authorId && !missionDetails.submittedSolution && (
                    <div className="flex flex-col space-y-2">
                        <Input
                            placeholder="提交你的解决方案链接或文本"
                            value={missionSolution}
                            onChange={(e) => setMissionSolution(e.target.value)}
                            className="bg-transparent border-[#00E4FF] text-white"
                        />
                        <Button onClick={() => submitMissionSolution(thread.id, missionSolution)} className="bg-[#FF00FF] text-[#1A1A2E] hover:bg-[#FF88FF]"><Play className="mr-2" /> 提交解决方案</Button>
                    </div>
                )}
                {missionDetails.submittedSolution && (
                    <div className="bg-[#2B2B4A] p-4 rounded-md">
                        <p className="text-white font-bold">已提交的解决方案：</p>
                        <p className="text-[#B0B0CC] break-words">{missionDetails.submittedSolution}</p>
                        {user?.id === thread.authorId && !missionDetails.isApproved && (
                            <Button onClick={() => approveMission(thread.id)} className="mt-4 bg-[#00E4FF] text-[#1A1A2E] hover:bg-[#00BFFF]"><Check className="mr-2" /> 批准并奖励</Button>
                        )}
                        {missionDetails.isApproved && (
                            <p className="mt-4 text-green-400 font-bold">任务已批准，奖励已发放！</p>
                        )}
                    </div>
                )}
                {thread.isCompleted && <p className="text-green-400 font-bold mt-4">任务已完成！</p>}
            </CardContent>
        </Card>
    );

    const renderReply = (reply: Reply) => {
        const replyAuthor = users.find(u => u.id === reply.authorId);
        const safeContent = DOMPurify.sanitize(reply.content, { USE_PROFILES: { html: true } });
        const isContentImage = isImageUrl(safeContent);
        
        return (
            <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#2B2B4A] p-4 rounded-lg space-y-2"
            >
                <div className="flex items-center space-x-3">
                    <Image src={replyAuthor?.avatarUrl || '/avatars/default.png'} alt={replyAuthor?.username || '未知'} width={32} height={32} className="rounded-full" />
                    <div>
                        <span className="font-bold text-white cursor-pointer hover:underline" onClick={() => setView('profile', replyAuthor?.username)}>{replyAuthor?.username || '未知用户'}</span>
                        <p className="text-xs text-[#B0B0CC] flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true, locale: {
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
                        </p>
                    </div>
                </div>
                <div className="text-white pl-10">
                    <div className="markdown-content">
                        {isContentImage ? <img src={safeContent} alt="Reply image" /> : HTMLReactParser(safeContent)}
                    </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-[#B0B0CC] pl-10">
                    <Button variant="ghost" className="p-0 h-auto text-[#B0B0CC] hover:text-green-400" onClick={() => toggleLike(thread.id, true, reply.id)}>
                        <ThumbsUp size={16} className="mr-1" />
                        <span>{reply.likes}</span>
                    </Button>
                    <Button variant="ghost" className="p-0 h-auto text-[#B0B0CC] hover:text-red-400" onClick={() => toggleDislike(thread.id, true, reply.id)}>
                        <ThumbsDown size={16} className="mr-1" />
                        <span>{reply.dislikes}</span>
                    </Button>
                    {user && (
                        <Button variant="ghost" className="p-0 h-auto text-[#B0B0CC] hover:text-[#00E4FF]" onClick={() => { setReplyToId(reply.id); replyRef.current?.focus(); }}>
                            回复
                        </Button>
                    )}
                </div>
                {reply.replies.length > 0 && (
                    <div className="ml-8 mt-4 space-y-4 border-l-2 border-[#3D3D5A] pl-4">
                        {reply.replies.map(renderReply)}
                    </div>
                )}
            </motion.div>
        );
    };

    const safeContent = DOMPurify.sanitize(thread.content, { USE_PROFILES: { html: true } });
    const isContentImage = isImageUrl(safeContent);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <Button onClick={() => setView('forum')} className="bg-[#2B2B4A] text-white hover:bg-[#3D3D5A]">返回论坛</Button>
            <Card className="bg-transparent backdrop-blur-md border-[#2B2B4A] shadow-lg">
                <CardHeader className="p-6 border-b border-[#2B2B4A]">
                    <div className="flex items-center space-x-4 mb-4">
                        <Image src={author?.avatarUrl || '/avatars/default.png'} alt={author?.username || '未知'} width={50} height={50} className="rounded-full" />
                        <div>
                            <CardTitle className="text-2xl font-bold text-white">{thread.title}</CardTitle>
                            <p className="text-[#B0B0CC] text-sm">
                                由 <span className="text-[#00E4FF] font-bold cursor-pointer hover:underline" onClick={() => setView('profile', author?.username)}>{author?.username || '未知用户'}</span> 发布于 {formatDistanceToNow(new Date(thread.timestamp), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    {thread.type === 'mission' && (
                        <Badge className="bg-red-600 text-white w-fit">任务</Badge>
                    )}
                </CardHeader>
                <CardContent className="p-6 markdown-content">
                    {isContentImage ? <img src={safeContent} alt="Thread image" /> : HTMLReactParser(safeContent)}
                </CardContent>
                <div className="flex items-center space-x-4 p-6 border-t border-[#2B2B4A]">
                    <Button variant="ghost" className="text-white hover:text-green-400" onClick={() => toggleLike(thread.id, false)}>
                        <ThumbsUp size={20} className="mr-2" />
                        <span>{thread.likes}</span>
                    </Button>
                    <Button variant="ghost" className="text-white hover:text-red-400" onClick={() => toggleDislike(thread.id, false)}>
                        <ThumbsDown size={20} className="mr-2" />
                        <span>{thread.dislikes}</span>
                    </Button>
                    <span className="flex items-center space-x-2 text-[#B0B0CC]">
                        <MessageCircle size={20} />
                        <span>{thread.replies.length}</span>
                    </span>
                </div>
            </Card>

            {thread.type === 'mission' && thread.missionDetails && <MissionCard missionDetails={thread.missionDetails} />}

            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">回复 ({thread.replies.length})</h3>
                {thread.replies.sort((a, b) => a.timestamp - b.timestamp).map(renderReply)}
            </div>

            {user && (
                <div className="mt-8 space-y-4">
                    <h3 className="text-2xl font-bold text-white">发表回复</h3>
                    {replyToId && (
                        <div className="p-2 bg-[#2B2B4A] rounded-md flex items-center justify-between text-[#B0B0CC]">
                            <span>正在回复 ID 为 {replyToId} 的评论...</span>
                            <Button variant="ghost" className="p-0 h-auto" onClick={() => setReplyToId(null)}>取消</Button>
                        </div>
                    )}
                    <Textarea
                        ref={replyRef}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="输入你的回复... 支持图片URL、视频URL。"
                        className="bg-transparent border-[#00E4FF] text-white h-32"
                    />
                    <Button onClick={handleReply} className="bg-[#00E4FF] text-[#1A1A2E] hover:bg-[#00BFFF] w-full md:w-auto">
                        提交回复
                    </Button>
                </div>
            )}
        </motion.div>
    );
}
