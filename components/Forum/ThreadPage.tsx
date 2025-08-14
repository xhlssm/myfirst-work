

'use client';
import { useStore } from '@/store';
import { useState, useRef, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import MissionCard from './MissionCard';
import ReplyItem from './ReplyItem';
import { MessageCircle, ThumbsUp, ThumbsDown, Tag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'dompurify';
import { isImageUrl } from '@/lib/utils';


export default function ThreadPage() {
    const { threads, users, user, setView, activeView, selectedUsername, addReply, toggleLike, toggleDislike, updateMissionSubtask, submitMissionSolution, approveMission } = useStore();
    const [replyContent, setReplyContent] = useState('');
    const [replyToId, setReplyToId] = useState<number | null>(null);
    const [missionSolution, setMissionSolution] = useState('');
    const replyRef = useRef<HTMLTextAreaElement>(null);

    if (activeView !== 'forum' || typeof selectedUsername !== 'number') return null;
    const thread = threads.find(t => t.id === selectedUsername);
    if (!thread) {
        return <div className="text-center p-8 text-[var(--light-gray)] neon-text glass-effect border-glow">帖子未找到。</div>;
    }
    const author = users.find(u => u.id === thread.authorId);
    const safeContent = DOMPurify.sanitize(thread.content, { USE_PROFILES: { html: true } });
    const isContentImage = isImageUrl(safeContent);
    const sortedReplies = useMemo(() => thread.replies.slice().sort((a, b) => a.timestamp - b.timestamp), [thread.replies]);

    return (
        <div className="max-w-3xl mx-auto py-8 space-y-8">
            <Button onClick={() => setView('forum')} className="btn-glow bg-[var(--dark-blue)] text-[var(--neon-blue)] hover:bg-[var(--neon-blue)] hover:text-[var(--dark-blue)] border-glow mb-4">返回论坛</Button>
            <Card className="glass-effect-strong border-glow card-hover">
                <CardHeader className="p-6 border-b border-glow">
                    <div className="flex items-center space-x-4 mb-4">
                        {thread.type === 'mission' && thread.missionDetails && (
                            <MissionCard
                                missionDetails={thread.missionDetails}
                                user={user}
                                thread={thread}
                                missionSolution={missionSolution}
                                setMissionSolution={setMissionSolution}
                                updateMissionSubtask={updateMissionSubtask}
                                submitMissionSolution={submitMissionSolution}
                                approveMission={approveMission}
                            />
                        )}
                        <div>
                            <CardTitle className="text-2xl font-bold neon-text flex items-center space-x-2">
                                {thread.type === 'mission' && <Tag className="mr-2" />}<span>{thread.title}</span>
                            </CardTitle>
                            <p className="text-[var(--light-gray)] text-sm">
                                由 <span className="text-[var(--neon-blue)] font-bold cursor-pointer hover:underline" onClick={() => setView('profile', author?.username)}>{author?.username || '未知用户'}</span> 发布于 {formatDistanceToNow(new Date(thread.timestamp), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    {thread.type === 'mission' && (
                        <Badge className="border-glow neon-text-pink w-fit">任务</Badge>
                    )}
                </CardHeader>
                <CardContent className="p-6 markdown-content glass-effect border-glow custom-scrollbar">
                    {isContentImage ? <img src={safeContent} alt="Thread image" /> : HTMLReactParser(safeContent)}
                </CardContent>
                <div className="flex items-center space-x-4 p-6 border-t border-glow">
                    <Button variant="ghost" className="btn-glow text-[var(--light-gray)] hover:text-[var(--neon-green)]" onClick={() => toggleLike(thread.id, false)}>
                        <ThumbsUp size={20} className="mr-2" />
                        <span>{thread.likes}</span>
                    </Button>
                    <Button variant="ghost" className="btn-glow text-[var(--light-gray)] hover:text-[var(--neon-pink)]" onClick={() => toggleDislike(thread.id, false)}>
                        <ThumbsDown size={20} className="mr-2" />
                        <span>{thread.dislikes}</span>
                    </Button>
                    <span className="flex items-center space-x-2 text-[var(--light-gray)]">
                        <MessageCircle size={20} />
                        <span>{thread.replies.length}</span>
                    </span>
                </div>
            </Card>

            <div className="space-y-4">
                <h3 className="text-2xl font-bold neon-text">回复 ({thread.replies.length})</h3>
                {sortedReplies.map(reply => (
                    <ReplyItem
                        key={reply.id}
                        reply={reply}
                        users={users}
                        setView={setView}
                        toggleLike={(id: number) => toggleLike(thread.id, true, id)}
                        toggleDislike={(id: number) => toggleDislike(thread.id, true, id)}
                        user={user}
                        setReplyToId={setReplyToId}
                        replyRef={replyRef}
                    />
                ))}
            </div>

            {user && (
                <div className="mt-8 space-y-4">
                    <h3 className="text-2xl font-bold neon-text-pink">发表回复</h3>
                    {replyToId && (
                        <div className="p-2 glass-effect border-glow rounded-md flex items-center justify-between text-[var(--light-gray)]">
                            <span>正在回复 ID 为 {replyToId} 的评论...</span>
                            <button className="p-0 h-auto bg-transparent border-none text-[var(--light-gray)] hover:text-[var(--neon-pink)]" onClick={() => setReplyToId(null)}>取消</button>
                        </div>
                    )}
                    <Textarea
                        ref={replyRef}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="输入你的回复... 支持图片URL、视频URL。"
                        className="glass-effect border-glow text-[var(--foreground)] h-32 custom-scrollbar"
                    />
                    <button onClick={() => {
                        if (!user || !replyContent.trim()) return;
                        addReply(thread.id, { content: replyContent, authorId: user.id }, replyToId || undefined);
                        setReplyContent('');
                        setReplyToId(null);
                    }} className="btn-glow bg-[var(--neon-blue)] text-[var(--dark-blue)] hover:bg-[var(--neon-pink)] hover:text-[var(--foreground)] w-full md:w-auto py-2 px-4 rounded border-glow">
                        提交回复
                    </button>
                </div>
            )}
        </div>
    );
}
