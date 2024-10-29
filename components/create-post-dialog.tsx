"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { mockPosts, MOCK_CATEGORIES } from '@/lib/mock-data';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (post: any) => void;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreatePostDialogProps) {
  const { register, handleSubmit, reset, control } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const newPost = mockPosts.create(data);
      toast.success('投稿を作成しました');
      reset();
      onSuccess(newPost);
    } catch (error) {
      toast.error('エラーが発生しました');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
            新規投稿の作成
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-slide-up">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">タイトル</Label>
            <Input
              id="title"
              placeholder="投稿のタイトルを入力"
              {...register('title', { required: true })}
              className="glass-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">カテゴリー</Label>
            <Controller
              name="categoryId"
              control={control}
              defaultValue={MOCK_CATEGORIES[0].id}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Label htmlFor="content" className="text-sm font-medium">内容</Label>
            <Textarea
              id="content"
              rows={5}
              placeholder="投稿の内容を入力"
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
              投稿する
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}