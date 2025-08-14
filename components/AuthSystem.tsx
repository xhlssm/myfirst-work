'use client';


// 类型声明必须在组件函数外部
interface AuthFormData {
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  emailCode: string;
  avatarUrl: string;
  bio: string;
  faction: string;
}
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Mail, 
  Phone, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Camera,
  Edit3,
  Save,
  X,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useStore } from '@/store';



export default function AuthSystem() {
  const { login, register, user } = useStore();

  // 状态分组：认证流程
  const [isLogin, setIsLogin] = useState(true);
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  // 密码可见性
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // 表单数据
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    emailCode: '',
    avatarUrl: user?.avatarUrl || 'https://via.placeholder.com/150',
    bio: user?.bio || '',
    faction: user?.faction || ''
  });
  // 验证码相关
  const [sentCode, setSentCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);
  const codeTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 错误提示
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  // 顶部验证码提示条
  const [codeTip, setCodeTip] = useState('');

  // 切换登录/注册时自动清空错误和验证码
  useEffect(() => {
    setErrors({});
    setCodeSent(false);
    setSentCode('');
    setFormData(f => ({ ...f, emailCode: '' }));
  }, [isLogin, authMethod]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (codeTimerRef.current) clearInterval(codeTimerRef.current);
    };
  }, []);


  // 增加邮箱格式校验
  const validateEmail = (email: string) => {
    // 简单邮箱正则
    return /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  // 发送验证码
  const handleSendCode = () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: '请输入邮箱地址' }));
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: '邮箱格式不正确' }));
      return;
    }
    // 生成6位验证码
    const code = Math.random().toString().slice(2, 8);
    setSentCode(code);
    setCodeSent(true);
    setErrors(prev => ({ ...prev, emailCode: undefined }));
    setCodeTip(`验证码已发送到邮箱（模拟）：${code}`);
    setTimeout(() => setCodeTip(''), 5000);
    setCodeTimer(60);
    if (codeTimerRef.current) clearInterval(codeTimerRef.current);
    codeTimerRef.current = setInterval(() => {
      setCodeTimer(t => {
        if (t <= 1) {
          if (codeTimerRef.current) clearInterval(codeTimerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const validateForm = () => {
    const newErrors: Partial<AuthFormData> = {};

    if (isLogin) {
      if (authMethod === 'email') {
        if (!formData.email) {
          newErrors.email = '请输入邮箱地址';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = '邮箱格式不正确';
        }
        // 验证码校验
        if (!codeSent) {
          newErrors.emailCode = '请先获取验证码';
        } else if (!formData.emailCode) {
          newErrors.emailCode = '请输入验证码';
        } else if (formData.emailCode !== sentCode) {
          newErrors.emailCode = '验证码不正确';
        }
      } else if (authMethod === 'phone' && !formData.phone) {
        newErrors.phone = '请输入手机号码';
      }
      if (!formData.password) {
        newErrors.password = '请输入密码';
      }
    } else {
      if (!formData.username) {
        newErrors.username = '请输入用户名';
      }
      if (authMethod === 'email') {
        if (!formData.email) {
          newErrors.email = '请输入邮箱地址';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = '邮箱格式不正确';
        }
        // 验证码校验
        if (!codeSent) {
          newErrors.emailCode = '请先获取验证码';
        } else if (!formData.emailCode) {
          newErrors.emailCode = '请输入验证码';
        } else if (formData.emailCode !== sentCode) {
          newErrors.emailCode = '验证码不正确';
        }
      } else if (authMethod === 'phone' && !formData.phone) {
        newErrors.phone = '请输入手机号码';
      }
      if (!formData.password) {
        newErrors.password = '请输入密码';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '两次输入的密码不一致';
      }
      if (formData.password.length < 6) {
        newErrors.password = '密码长度至少6位';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (isLogin) {
        const identifier = authMethod === 'email' ? formData.email : formData.phone;
        await login(identifier, formData.password);
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          avatarUrl: formData.avatarUrl,
          bio: formData.bio,
          faction: formData.faction
        });
      }
    } catch (error) {
      console.error('认证失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // 这里应该调用更新用户资料的API
      console.log('更新用户资料:', formData);
      setIsProfileEdit(false);
    } catch (error) {
      console.error('更新失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (user) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
            <User className="w-4 h-4 mr-2" />
            个人资料
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-effect-strong border-[#00E4FF]/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold neon-text">个人资料</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 头像区域 */}
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={formData.avatarUrl}
                  alt="头像"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#00E4FF]/30"
                  onError={e => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
                {isProfileEdit && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 bg-[#00E4FF] hover:bg-[#00E4FF]/90"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* 用户信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">用户名</label>
                {isProfileEdit ? (
                  <Input
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="bg-white/10 border-white/20 text-white transition-all duration-200"
                    placeholder="用户名 (2-12字)"
                    aria-describedby={errors.username ? 'username-error' : undefined}
                    aria-invalid={!!errors.username}
                  />
                ) : (
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white">{user.username}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">邮箱</label>
                {isProfileEdit ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white transition-all duration-200"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                ) : (
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white">{user.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">手机号</label>
                {isProfileEdit ? (
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-white/10 border-white/20 text-white transition-all duration-200"
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    aria-invalid={!!errors.phone}
                  />
                ) : (
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white">{user.phone || '未设置'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">派系</label>
                {isProfileEdit ? (
                  <Input
                    value={formData.faction}
                    onChange={(e) => handleInputChange('faction', e.target.value)}
                    className="bg-white/10 border-white/20 text-white transition-all duration-200"
                  />
                ) : (
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white">{user.faction || '自由人'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 个人简介 */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">个人简介</label>
              {isProfileEdit ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white resize-none focus:ring-2 focus:ring-[var(--neon-blue)] focus:border-[var(--neon-blue)] focus:shadow-[0_0_8px_2px_var(--neon-blue)] hover:border-[var(--neon-pink)] hover:shadow-[0_0_8px_2px_var(--neon-pink)] hover:scale-105 transition-all duration-200"
                  placeholder="介绍一下你自己...（可选）"
                  aria-describedby={errors.bio ? 'bio-error' : undefined}
                  aria-invalid={!!errors.bio}
                />
              ) : (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-white">{user.bio || '这个人很懒，什么都没写...'}</span>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-3">
              {isProfileEdit ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsProfileEdit(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    取消
                  </Button>
                  <Button
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white hover:from-[#00E4FF]/90 hover:to-[#FF00FF]/90 btn-glow"
                    aria-disabled={isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? '保存中...' : '保存'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsProfileEdit(true)}
                  className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white hover:from-[#00E4FF]/90 hover:to-[#FF00FF]/90 btn-glow"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  编辑资料
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-pink)] text-white hover:from-[var(--neon-blue)]/90 hover:to-[var(--neon-pink)]/90 btn-glow px-8 py-3 text-lg font-bold shadow-lg rounded-xl">
          <User className="w-5 h-5 mr-2" />
          {isLogin ? '登录' : '注册'}
        </Button>
      </DialogTrigger>

      {/* 居中大弹窗，带明显遮罩和动画 */}
      <DialogContent
        className="glass-effect-strong border-[var(--neon-blue)]/80 max-w-lg w-full mx-auto rounded-2xl shadow-2xl p-0 animate-dialog-pop relative neon-glow"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          zIndex: 10000,
          background: 'rgba(35,41,70,0.98)',
          boxShadow: '0 0 40px 8px var(--neon-blue), 0 8px 40px 0 rgba(62,207,255,0.15), 0 1.5px 0 rgba(255,255,255,0.08)'
        }}
      >
        {/* 顶部验证码 neon 提示条 */}
        {codeTip && (
          <div className="w-full text-center py-2 px-4 mb-2 bg-gradient-to-r from-[var(--neon-blue)]/80 to-[var(--neon-pink)]/80 text-white font-bold rounded-t-2xl animate-fade-in shadow-lg">
            {codeTip}
          </div>
        )}

        {/* 霓虹光晕特效 */}
        <div className="pointer-events-none absolute -inset-8 z-0 blur-2xl opacity-60" style={{background: 'radial-gradient(circle, var(--neon-blue) 0%, transparent 70%)'}} />
        <DialogHeader>
          <DialogTitle className="text-xl font-bold neon-text text-center">
            {isLogin ? '欢迎回来' : '加入我们'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 认证方式切换 */}
          <div className="flex space-x-2 p-1 bg-white/5 rounded-lg">
            <Button
              type="button"
              variant={authMethod === 'email' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 ${authMethod === 'email' 
                ? 'bg-[#00E4FF] text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Mail className="w-4 h-4 mr-2" />
              邮箱
            </Button>
            <Button
              type="button"
              variant={authMethod === 'phone' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 ${authMethod === 'phone' 
                ? 'bg-[#00E4FF] text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Phone className="w-4 h-4 mr-2" />
              手机
            </Button>
          </div>

          {/* 用户名（仅注册时显示） */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">用户名</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-[var(--neon-blue)] focus:border-[var(--neon-blue)] focus:shadow-[0_0_8px_2px_var(--neon-blue)] hover:border-[var(--neon-pink)] hover:shadow-[0_0_8px_2px_var(--neon-pink)] hover:scale-105 transition-all duration-200"
                  placeholder="请输入用户名"
                  autoComplete="username"
                  aria-label="用户名"
                  disabled={isLoading}
                  onFocus={e => e.target.scrollIntoView({behavior:'smooth',block:'center'})}
                />
                {/* 辅助提示 */}
                {errors.username && (
                  <div className="text-red-500 text-xs font-bold mb-1 flex items-center animate-shake animate-fade-in border-l-4 border-[var(--neon-pink)] pl-2 bg-white/5/50 shadow-[0_0_8px_0_var(--neon-pink)]">
                    <AlertCircle className="w-4 h-4 mr-1" />{errors.username}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 邮箱/手机号+验证码 */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              {authMethod === 'email' ? '邮箱地址' : '手机号码'}
            </label>
            <div className="relative flex space-x-2">
              {authMethod === 'email' ? (
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              ) : (
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              )}
              <Input
                type={authMethod === 'email' ? 'email' : 'tel'}
                value={authMethod === 'email' ? formData.email : formData.phone}
                onChange={(e) => handleInputChange(authMethod, e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white flex-1 focus:ring-2 focus:ring-[var(--neon-blue)] focus:border-[var(--neon-blue)] focus:shadow-[0_0_8px_2px_var(--neon-blue)] hover:border-[var(--neon-pink)] hover:shadow-[0_0_8px_2px_var(--neon-pink)] hover:scale-105 transition-all duration-200"
                placeholder={authMethod === 'email' ? '邮箱地址（必填）' : '手机号码（必填）'}
                autoComplete={authMethod === 'email' ? 'email' : 'tel'}
                aria-label={authMethod === 'email' ? '邮箱地址' : '手机号码'}
                disabled={isLoading}
                onFocus={e => e.target.scrollIntoView({behavior:'smooth',block:'center'})}
              />
              {/* 辅助提示 */}
              {errors[authMethod] && (
                <div className="text-red-500 text-xs font-bold mb-1 flex items-center animate-shake animate-fade-in border-l-4 border-[var(--neon-pink)] pl-2 bg-white/5/50 shadow-[0_0_8px_0_var(--neon-pink)]">
                  <AlertCircle className="w-4 h-4 mr-1" />{errors[authMethod]}
                </div>
              )}
            </div>
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-[var(--neon-blue)] focus:border-[var(--neon-blue)] focus:shadow-[0_0_8px_2px_var(--neon-blue)] hover:border-[var(--neon-pink)] hover:shadow-[0_0_8px_2px_var(--neon-pink)] hover:scale-105 transition-all duration-200"
                placeholder="密码（6位以上）"
                autoComplete="current-password"
                aria-label="密码"
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={!!errors.password}
                disabled={isLoading}
                ref={el => { if (el && errors.password && !formData.password) el.focus(); }}
                onFocus={e => e.target.scrollIntoView({behavior:'smooth',block:'center'})}
                onKeyDown={e => { if(e.key==='Enter'){ e.currentTarget.form?.dispatchEvent(new Event('submit', {cancelable:true,bubbles:true})); }}}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-3 text-white/50 hover:text-white hover:bg-white/10"
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                title={showPassword ? '隐藏密码' : '显示密码'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.password && (
              <div className="text-red-500 text-xs font-bold mb-1 flex items-center animate-shake animate-fade-in" id="password-error">
                <AlertCircle className="w-4 h-4 mr-1" />{errors.password}
              </div>
            )}
          </div>

          {/* 确认密码（仅注册时显示） */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">确认密码</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-[var(--neon-blue)] focus:border-[var(--neon-blue)] focus:shadow-[0_0_8px_2px_var(--neon-blue)] hover:border-[var(--neon-pink)] hover:shadow-[0_0_8px_2px_var(--neon-pink)] hover:scale-105 transition-all duration-200"
                  placeholder="确认密码"
                  autoComplete="new-password"
                  aria-label="确认密码"
                  disabled={isLoading}
                  onFocus={e => e.target.scrollIntoView({behavior:'smooth',block:'center'})}
                  onKeyDown={e => { if(e.key==='Enter'){ e.currentTarget.form?.dispatchEvent(new Event('submit', {cancelable:true,bubbles:true})); }}}
                  aria-describedby={errors.confirmPassword ? 'confirmpw-error' : undefined}
                  aria-invalid={!!errors.confirmPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-full px-3 text-white/50 hover:text-white hover:bg-white/10"
                  aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
                  title={showConfirmPassword ? '隐藏密码' : '显示密码'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <div className="text-red-500 text-xs font-bold mb-1 flex items-center animate-shake animate-fade-in" id="confirmpw-error">
                  <AlertCircle className="w-4 h-4 mr-1" />{errors.confirmPassword}
                </div>
              )}
            </div>
          )}

          {/* 提交按钮 */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-pink)] text-white hover:from-[var(--neon-blue)]/90 hover:to-[var(--neon-pink)]/90 btn-glow focus:ring-2 focus:ring-[var(--neon-pink)] focus:shadow-[0_0_12px_2px_var(--neon-pink)] hover:shadow-[0_0_16px 4px_var(--neon-pink)] hover:scale-105 transition-all duration-200 active:scale-95 active:brightness-110"
            tabIndex={0}
            aria-disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 border-t-transparent border-l-transparent"></div>
                {isLogin ? '登录中...' : '注册中...'}
              </div>
            ) : (
              isLogin ? '登录' : '注册'
            )}
          </Button>

          {/* 切换模式 */}
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              {isLogin ? '还没有账号？立即注册' : '已有账号？立即登录'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

