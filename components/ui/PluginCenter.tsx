// 用户插件中心，支持自定义小组件/主题/脚本
'use client';
import { useState } from 'react';
import { Puzzle, PlusCircle } from 'lucide-react';

const mockPlugins = [
  { name: '天气小组件', desc: '显示实时天气', enabled: true },
  { name: '倒计时', desc: '重要事件倒计时', enabled: false },
  { name: '自定义主题', desc: '上传你的配色', enabled: false },
  { name: '快捷命令面板', desc: '一键执行常用操作', enabled: true },
];

export default function PluginCenter() {
  const [open, setOpen] = useState(false);
  const [plugins, setPlugins] = useState(mockPlugins);
  const toggle = idx => setPlugins(ps => ps.map((p,i)=>i===idx?{...p,enabled:!p.enabled}:p));
  return (
    <div className="fixed bottom-24 right-8 z-50">
      <button onClick={()=>setOpen(o=>!o)} className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white p-4 rounded-full shadow-xl hover:scale-110 transition">
        <Puzzle className="w-6 h-6" />
      </button>
      {open && (
        <div className="mt-3 bg-[#181824] rounded-2xl shadow-2xl border border-[#00E4FF] p-6 w-80 animate-fade-in">
          <div className="font-bold text-white mb-3 flex items-center gap-2"><Puzzle className="w-5 h-5" />插件中心</div>
          <ul className="space-y-2">
            {plugins.map((p,i)=>(
              <li key={p.name} className="flex items-center justify-between text-white/90">
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs text-[#B0B0CC]">{p.desc}</div>
                </div>
                <button onClick={()=>toggle(i)} className={`ml-2 px-3 py-1 rounded-full text-xs ${p.enabled?'bg-[var(--neon-blue)] text-white':'bg-white/10 text-[#B0B0CC]'}`}>{p.enabled?'已启用':'启用'}</button>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white py-2 rounded-xl hover:scale-105 transition"><PlusCircle className="w-4 h-4" />上传/开发新插件</button>
        </div>
      )}
    </div>
  );
}
