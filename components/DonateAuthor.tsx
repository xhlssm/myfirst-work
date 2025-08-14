import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DonateAuthor() {
  const [amount, setAmount] = useState(10);
  const [isPaying, setIsPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDonate = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="glass-effect border-glow p-6 rounded-xl max-w-xs mx-auto text-center space-y-4">
      <h3 className="text-xl font-bold neon-text">支持网站作者</h3>
      <p className="text-[var(--light-gray)] text-sm">如果你喜欢本站，欢迎打赏支持作者持续优化和维护！</p>
      <div className="flex items-center justify-center gap-2">
        <input
          type="number"
          min={1}
          max={999}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="w-20 px-2 py-1 rounded border border-[var(--neon-blue)] bg-transparent text-white text-center focus:outline-none"
          disabled={isPaying || success}
        />
        <span className="text-[var(--neon-blue)] font-bold">元</span>
      </div>
      <Button
        onClick={handleDonate}
        className="w-full bg-[var(--neon-blue)] text-[var(--dark-blue)] hover:bg-[var(--neon-pink)] hover:text-white border-glow mt-2"
        disabled={isPaying || success}
      >
        {isPaying ? '支付中...' : success ? '感谢支持！' : `打赏作者`}
      </Button>
      {success && <div className="text-[var(--neon-green)] mt-2">已收到你的支持 ❤</div>}
    </div>
  );
}
