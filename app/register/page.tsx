"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Building2, ArrowLeft } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      // Check if email already exists
      const existingUser = MOCK_USERS.find(user => user.email === data.email);
      if (existingUser) {
        throw new Error('このメールアドレスは既に登録されています');
      }

      // In a real app, we would save the user here
      // For demo, just show success and redirect
      toast.success('アカウントを作成しました。ログインしてください。');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Building2 className="h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold">アカウント作成</CardTitle>
          <CardDescription>
            必要事項を入力してアカウントを作成してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">氏名</Label>
              <Input
                id="name"
                type="text"
                placeholder="山田 太郎"
                {...register('name', { required: '氏名を入力してください' })}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                {...register('email', {
                  required: 'メールアドレスを入力してください',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '有効なメールアドレスを入力してください',
                  },
                })}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                {...register('password', {
                  required: 'パスワードを入力してください',
                  minLength: {
                    value: 8,
                    message: 'パスワードは8文字以上で入力してください',
                  },
                })}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message as string}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? 'アカウント作成中...' : 'アカウントを作成'}
            </Button>
            <div className="text-center text-sm">
              <Link href="/" className="text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> ログインに戻る
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}