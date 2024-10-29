"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { mockPosts, MOCK_CATEGORIES } from '@/lib/mock-data';

interface EditPostDialogProps {
  post: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (post: any) => void;
}

export function EditPostDialog({
  post,
  open,
  onOpenChange,
  onSuccess,
}: EditPostDialogProps) {
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      title: post.title,
      content: post.content,
      categoryId: post.category.id,
    },
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        content: post.content,
        categoryId: post.category.id,
      });
    }
  }, [post, reset]);

  const onSubmit = async (data: any) => {
    try {
      const updatedPost = mockPosts.update(post.id, data);
      toast.success('投稿を更新しました');
      onSuccess(updatedPost);
    } catch (error) {
      toast.error('エラーが発生しました');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
            投稿の編集
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              {...register('title', { required: true })}
              className="glass-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">カテゴリー</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="カテゴリーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              rows={5}
              {...register('content', { required: true })}
              className="glass-input resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="glass-effect hover:bg-white/10"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 transition-all duration-300"
            >
              更新する
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}