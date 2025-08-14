'use client';
import { useState } from 'react';
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

interface AuthFormData {
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  avatarUrl: string;
  bio: string;
  faction: string;
}

export default function AuthSystem() {
  const { login, register, user } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    avatarUrl: user?.avatarUrl || 'https://via.placeholder.com/150',
    bio: user?.bio || '',
    faction: user?.faction || ''
  });

  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<AuthFormData> = {};

    if (isLogin) {
      if (authMethod === 'email' && !formData.email) {
        newErrors.email = '请输入邮箱地址';
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
      if (authMethod === 'email' && !formData.email) {
        newErrors.email = '请输入邮箱地址';
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
                    className="bg-white/10 border-white/20 text-white"
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
                    className="bg-white/10 border-white/20 text-white"
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
                    className="bg-white/10 border-white/20 text-white"
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
                    className="bg-white/10 border-white/20 text-white"
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
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white resize-none"
                  placeholder="介绍一下你自己..."
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
        <Button className="bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white hover:from-[#00E4FF]/90 hover:to-[#FF00FF]/90 btn-glow">
          <User className="w-4 h-4 mr-2" />
          {isLogin ? '登录' : '注册'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="glass-effect-strong border-[#00E4FF]/50 max-w-md">
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
                  className="pl-10 bg-white/10 border-white/20 text-white"
                  placeholder="请输入用户名"
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.username}
                </p>
              )}
            </div>
          )}

          {/* 邮箱/手机号 */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              {authMethod === 'email' ? '邮箱地址' : '手机号码'}
            </label>
            <div className="relative">
              {authMethod === 'email' ? (
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              ) : (
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              )}
              <Input
                type={authMethod === 'email' ? 'email' : 'tel'}
                value={authMethod === 'email' ? formData.email : formData.phone}
                onChange={(e) => handleInputChange(authMethod, e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white"
                placeholder={authMethod === 'email' ? '请输入邮箱地址' : '请输入手机号码'}
              />
            </div>
            {errors[authMethod] && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors[authMethod]}
              </p>
            )}
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
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white"
                placeholder="请输入密码"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-3 text-white/50 hover:text-white hover:bg-white/10"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </p>
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
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white"
                  placeholder="请再次输入密码"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-full px-3 text-white/50 hover:text-white hover:bg-white/10"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* 提交按钮 */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#00E4FF] to-[#FF00FF] text-white hover:from-[#00E4FF]/90 hover:to-[#FF00FF]/90 btn-glow"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

