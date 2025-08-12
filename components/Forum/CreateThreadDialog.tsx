'use client';
import { useStore } from '@/store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateThreadDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateThreadDialog({ isOpen, onClose }: CreateThreadDialogProps) {
    const { addThread, user } = useStore();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [threadType, setThreadType] = useState<'post' | 'mission'>('post');
    const [missionReward, setMissionReward] = useState(100);

    const handleSubmit = () => {
        if (!user || !title || !content) {
            alert('标题和内容不能为空！');
            return;
        }

        const newThread = {
            title,
            content,
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
        setThreadType('post');
        setMissionReward(100);
        onClose();
    };

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
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="col-span-3 bg-transparent text-white border-[#00E4FF] h-32"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={onClose} className="bg-[#2B2B4A] hover:bg-[#3D3D5A] text-white">
                        取消
                    </Button>
                    <Button onClick={handleSubmit} className="bg-[#00E4FF] text-[#1A1A2E] hover:bg-[#00BFFF]">
                        发布
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
