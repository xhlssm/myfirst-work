'use client';
import { useStore } from '@/store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateThreadDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateThreadDialog({ isOpen, onClose }: CreateThreadDialogProps) {
    const { addThread, user } = useStore();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [threadType, setThreadType] = useState<'post' | 'mission'>('post');
    const [missionReward, setMissionReward] = useState(100);
    const [preview, setPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        if (!user || !title.trim() || !content.trim()) {
            alert('标题和内容不能为空！');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            const newThread = {
                title,
                content,
                tags,
                authorId: user.id,
                type: threadType,
                missionDetails: threadType === 'mission' ? {
                    reward: missionReward,
                    deadline: Date.now() + 86400000 * 7,
                    subtasks: [{ id: 1, description: '完成任务要求', completed: false }]
                } : undefined
            };
            addThread(newThread);
            setTitle('');
            setContent('');
            setTags([]);
            setTagInput('');
            setThreadType('post');
            setMissionReward(100);
            setIsLoading(false);
            onClose();
        }, 600);
    };
                    {/* 标签输入区 */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="tags" className="text-right text-[#B0B0CC]">标签</label>
                        <div className="col-span-3 flex flex-wrap items-center gap-2">
                            {tags.map((tag, idx) => (
                                <span key={tag+idx} className="bg-[var(--neon-blue)]/20 text-[var(--neon-blue)] px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                    {tag}
                                    <button type="button" className="ml-1 text-xs text-[var(--neon-pink)] hover:underline" onClick={() => setTags(tags.filter((t, i) => i !== idx))}>×</button>
                                </span>
                            ))}
                            <input
                                id="tags"
                                type="text"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => {
                                    if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && tagInput.trim()) {
                                        e.preventDefault();
                                        if (!tags.includes(tagInput.trim()) && tags.length < 5) setTags([...tags, tagInput.trim()]);
                                        setTagInput('');
                                    }
                                }}
                                className="bg-transparent border-b border-[var(--neon-blue)] text-white w-24 focus:outline-none"
                                placeholder="回车添加，最多5个"
                                maxLength={12}
                                disabled={isLoading || tags.length >= 5}
                            />
                        </div>
                    </div>

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1A1A2E] text-white border-[#00E4FF]">
                <DialogHeader>
                    <DialogTitle className="text-[#00E4FF]">发布新内容</DialogTitle>
                    <DialogDescription className="text-[#B0B0CC]">
                        在这里分享你的想法或发布一个任务。
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="thread-type" className="text-right text-[#B0B0CC]">
                            类型
                        </label>
                        <Select value={threadType} onValueChange={(value: 'post' | 'mission') => setThreadType(value)}>
                            <SelectTrigger className="col-span-3 bg-transparent text-white border-[#00E4FF]">
                                <SelectValue placeholder="选择类型" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A1A2E] text-white border-[#00E4FF]">
                                <SelectItem value="post">帖子</SelectItem>
                                <SelectItem value="mission">任务</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="title" className="text-right text-[#B0B0CC]">
                            标题
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3 bg-transparent text-white border-[#00E4FF]"
                        />
                    </div>
                    {threadType === 'mission' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="mission-reward" className="text-right text-[#B0B0CC]">
                                奖励 (声望)
                            </label>
                            <Input
                                id="mission-reward"
                                type="number"
                                value={missionReward}
                                onChange={(e) => setMissionReward(parseInt(e.target.value))}
                                className="col-span-3 bg-transparent text-white border-[#00E4FF]"
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <label htmlFor="content" className="text-right text-[#B0B0CC]">
                            内容
                        </label>
                        <div className="col-span-3 space-y-2">
                            <Textarea
                                id="content"
                                ref={contentRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="bg-transparent text-white border-[#00E4FF] h-32"
                                maxLength={1000}
                                placeholder="支持插入图片/视频URL，支持Markdown格式"
                                disabled={isLoading}
                                onKeyDown={e => { if(e.ctrlKey && e.key==='Enter'){ handleSubmit(); }}}
                            />
                            <div className="flex items-center justify-between text-xs text-[var(--light-gray)]">
                                <span>{content.length}/1000 字符</span>
                                <button type="button" className="text-[var(--neon-blue)] hover:underline" onClick={() => setPreview(v => !v)}>{preview ? '关闭预览' : '实时预览'}</button>
                            </div>
                            {preview && (
                                <div className="mt-2 p-2 rounded bg-[#232946] border border-[var(--neon-blue)] text-white text-sm">
                                    {/* 简单图片/视频/Markdown预览 */}
                                    {/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(content.trim()) ? (
                                        <img src={content.trim()} alt="预览图片" className="max-w-full rounded" />
                                    ) : /^https?:\/\/.+\.(mp4|webm|ogg)$/i.test(content.trim()) ? (
                                        <video src={content.trim()} controls className="max-w-full rounded" />
                                    ) : (
                                        <span style={{whiteSpace:'pre-wrap'}}>{content}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={onClose} className="bg-[#2B2B4A] hover:bg-[#3D3D5A] text-white" disabled={isLoading}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit} className="bg-[#00E4FF] text-[#1A1A2E] hover:bg-[#00BFFF]" disabled={isLoading || !title.trim() || !content.trim()}>
                        {isLoading ? '发布中...' : '发布'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
