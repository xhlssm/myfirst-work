'use client';
import { useStore } from '@/store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { isImageUrl } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VoiceInput from '../ui/VoiceInput';

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
    const [aiLoading, setAiLoading] = useState(false);
    // AI标签推荐（本地模拟）
    const handleAISuggest = () => {
        setAiLoading(true);
        setTimeout(() => {
            // 简单关键词模拟
            const kw = content.toLowerCase();
            const rec: string[] = [];
            if (kw.includes('ai') || kw.includes('智能')) rec.push('AI');
            if (kw.includes('前端') || kw.includes('react') || kw.includes('界面')) rec.push('前端');
            if (kw.includes('安全') || kw.includes('防护')) rec.push('安全');
            if (kw.includes('三维') || kw.includes('3d') || kw.includes('three')) rec.push('3D');
            if (kw.includes('插件') || kw.includes('扩展')) rec.push('插件');
            if (kw.includes('成就') || kw.includes('激励')) rec.push('成就');
            if (rec.length) setTags(Array.from(new Set([...tags, ...rec])));
            setAiLoading(false);
        }, 800);
    };
    const [missionReward, setMissionReward] = useState(100);
    const [preview, setPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [imageUploading, setImageUploading] = useState(false);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const emojiList = ['😀','😂','😍','🥰','😎','😭','😡','👍','👏','🎉','🔥','💡','🤔','🥳','😏','😅','😱','🤖','🧋','🍕','🌈','⭐','💯'];

    // 插入表情到光标处
    const insertEmoji = (emoji: string) => {
        if (!contentRef.current) return;
        const textarea = contentRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = content.slice(0, start);
        const after = content.slice(end);
        setContent(before + emoji + after);
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        }, 0);
    };
    // 简单模拟图片合法性审核
    const checkImageLegal = (file: File): Promise<string | null> => {
        return new Promise((resolve) => {
            // 仅允许图片类型
            if (!file.type.startsWith('image/')) {
                resolve('仅支持图片文件');
                return;
            }
            // 限制大小 2MB
            if (file.size > 2 * 1024 * 1024) {
                resolve('图片大小不能超过2MB');
                return;
            }
            // 可扩展：AI/接口内容审核
            resolve(null);
        });
    };

    // 处理图片上传
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageUploading(true);
        const err = await checkImageLegal(file);
        if (err) {
            setErrorMsg(err);
            setImageUploading(false);
            return;
        }
        // 模拟上传，实际应上传到云存储/CDN
        const reader = new FileReader();
        reader.onload = () => {
            const url = reader.result as string;
            setContent(c => c + `\n![图片](${url})`);
            setImageUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        if (!user) {
            setErrorMsg('请先登录！');
            return;
        }
        if (!title.trim()) {
            setErrorMsg('标题不能为空！');
            return;
        }
        if (!content.trim()) {
            setErrorMsg('内容不能为空！');
            return;
        }
        if (threadType === 'mission') {
            if (user.reputation < missionReward) {
                setErrorMsg('声望不足，无法发布该任务！');
                return;
            }
            if (user.level < 5) {
                setErrorMsg('等级需达到5级才能发布任务！');
                return;
            }
        }
        setErrorMsg('');
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gradient-to-br from-[#181824] via-[#232946] to-[#1A1A2E] text-white border-[var(--neon-blue)] max-w-lg w-full mx-auto rounded-3xl shadow-[0_8px_48px_#00e4ff44] animate-dialog-pop p-0 overflow-hidden">
                <DialogHeader className="bg-gradient-to-r from-[#00E4FF]/30 to-[#FF00FF]/20 px-8 py-6 rounded-t-3xl border-b border-[#00E4FF]/20">
                    <DialogTitle className="text-2xl font-bold neon-text drop-shadow-lg">发布新内容</DialogTitle>
                    <DialogDescription className="text-[#B0B0CC] mt-1 text-base">在这里分享你的想法或发布一个任务。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6 px-8">
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
                        <div className="col-span-3 flex items-center gap-2">
                            <Input
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="标题"
                                className="bg-transparent border-b border-[var(--neon-blue)] text-white"
                                maxLength={40}
                                disabled={isLoading}
                            />
                            <VoiceInput onResult={txt => setTitle(txt)} />
                            <button type="button" className="ml-2 text-xs px-2 py-1 rounded border border-[var(--neon-blue)] text-[var(--neon-blue)] hover:bg-[#232946]" onClick={handleAISuggest} disabled={aiLoading || !content.trim()}>{aiLoading ? 'AI分析中...' : 'AI推荐标签'}</button>
                        </div>
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
                        <div className="col-span-3 space-y-3">
                            <div className="flex items-center gap-2 mb-1">
                                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading || isLoading} className="text-xs" />
                                {imageUploading && <span className="text-xs text-[var(--neon-blue)] animate-pulse">图片上传中...</span>}
                                <button type="button" className="ml-2 text-[var(--neon-blue)] text-sm px-3 py-1 rounded-full bg-gradient-to-r from-[#00E4FF]/10 to-[#FF00FF]/10 border border-[var(--neon-blue)]/40 shadow hover:bg-[#232946] transition-all" onClick={()=>setShowEmoji(v=>!v)}>
                                    {showEmoji ? '关闭表情' : '😀 表情'}
                                </button>
                            </div>
                            {showEmoji && (
                                <div className="flex flex-wrap gap-1 p-2 bg-gradient-to-r from-[#232946] to-[#181824] border border-[var(--neon-blue)] rounded-xl mb-2 max-w-xs animate-fade-in shadow">
                                    {emojiList.map(e=>(
                                        <button key={e} type="button" className="text-2xl hover:scale-125 transition-all" onClick={()=>insertEmoji(e)}>{e}</button>
                                    ))}
                                </div>
                            )}
                            <Textarea
                                id="content"
                                ref={contentRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="bg-gradient-to-br from-[#232946] to-[#181824] text-white border-2 border-[#00E4FF]/40 h-32 rounded-xl shadow-inner focus:ring-2 focus:ring-[#00E4FF]"
                                maxLength={1000}
                                placeholder="支持插入图片/视频URL，支持Markdown格式，可上传图片"
                                disabled={isLoading || imageUploading}
                                onKeyDown={e => { if(e.ctrlKey && e.key==='Enter'){ handleSubmit(); }}}
                            />
                            <div className="flex items-center justify-between text-xs text-[var(--light-gray)] mt-1">
                                <span className="rounded-full bg-[#232946] px-3 py-1 text-[var(--neon-blue)] font-bold shadow-inner">{content.length}/1000 字符</span>
                                <div className="flex gap-2">
                                    <button type="button" className="text-[var(--neon-blue)] hover:underline font-bold" onClick={() => setPreview(v => !v)}>{preview ? '关闭预览' : '实时预览'}</button>
                                    <button type="button" className="text-[var(--neon-blue)] hover:underline font-bold" onClick={handleAISuggest} disabled={aiLoading || !content.trim()}>{aiLoading ? 'AI分析中...' : 'AI推荐标签'}</button>
                                </div>
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
                {/* 错误提示 */}
                {errorMsg && <div className="text-red-500 text-sm mb-2 text-center animate-fade-in">{errorMsg}</div>}
                {/* 标签展示区 */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-gradient-to-r from-[#00E4FF]/30 to-[#FF00FF]/20 text-[var(--neon-blue)] text-xs font-bold border border-[var(--neon-blue)]/40 shadow animate-glow">#{tag}</span>
                        ))}
                    </div>
                )}
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="secondary" onClick={onClose} className="bg-gradient-to-r from-[#232946] to-[#2B2B4A] hover:bg-[#3D3D5A] text-white rounded-full px-6 py-2 shadow" disabled={isLoading}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit} className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white font-bold rounded-full px-8 py-2 shadow-lg hover:from-[#00BFFF] hover:to-[#FF88FF] animate-glow" disabled={isLoading || !title.trim() || !content.trim()}>
                        {isLoading ? '发布中...' : '发布'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
