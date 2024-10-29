"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      if (data.password === 'password') {
        const user = {
          id: '1',
          email: data.email,
          name: 'デモユーザー'
        };
        localStorage.setItem('auth_token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/dashboard');
        toast.success('ログインしました');
      } else {
        throw new Error('認証エラー');
      }
    } catch (error) {
      toast.error('メールアドレスまたはパスワードが正しくありません（デモ用パスワード: "password"）');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-green-900/30 backdrop-blur-sm"></div>
      <Card className="w-full max-w-md glass-card animate-fade-in relative z-10">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full glass-effect flex items-center justify-center mb-2">
            <Building2 className="h-8 w-8 text-emerald-600" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            ログイン
          </CardTitle>
          <CardDescription className="text-base">
            社内掲示板にアクセスするにはログインしてください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-slide-up">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                {...register('email', { required: true })}
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">パスワード</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: true })}
                className="glass-input"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 transition-all duration-300"
            >
              ログイン
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">アカウントをお持ちでない方は </span>
              <Link 
                href="/register" 
                className="text-emerald-500 hover:text-emerald-600 transition-colors duration-200 hover:underline"
              >
                新規登録
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}