"use client"

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit2, Trash2, Calendar, User, Circle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { EditPostDialog } from './edit-post-dialog';
import { useState } from 'react';
import { mockPosts } from '@/lib/mock-data';

const categoryColors: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  red: 'bg-red-500/10 text-red-500 border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  gray: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

interface PostDetailProps {
  post: any;
  onBack: () => void;
  onUpdate: (post: any) => void;
  onDelete: (postId: string) => void;
  onReadStatusChange: (postId: string, isRead: boolean) => void;
}

export function PostDetail({ post, onBack, onUpdate, onDelete, onReadStatusChange }: PostDetailProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async (postId: string) => {
    try {
      mockPosts.delete(postId);
      toast.success('投稿を削除しました');
      onDelete(postId);
      onBack();
    } catch (error) {
      toast.error('エラーが発生しました');
    }
  };

  const toggleReadStatus = () => {
    onReadStatusChange(post.id, !post.isRead);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          className="gap-2 hover:text-emerald-500 transition-colors duration-200"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          一覧に戻る
        </Button>
        <Button
          variant="outline"
          className={`gap-2 ${post.isRead ? 'text-muted-foreground' : 'text-blue-500'}`}
          onClick={toggleReadStatus}
        >
          <Circle className={`h-3 w-3 ${post.isRead ? '' : 'fill-current'}`} />
          {post.isRead ? '未読にする' : '既読にする'}
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${categoryColors[post.category.color]} px-2 py-0.5`}>
                  {post.category.name}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold">
                {post.title}
              </CardTitle>
              <CardDescription className="flex flex-col gap-1">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-500" />
                  投稿者: {post.author.name}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  {format(new Date(post.createdAt), 'PPP', { locale: ja })}
                </span>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="glass-effect hover:bg-emerald-500/10 transition-colors duration-200"
              >
                <Edit2 className="h-4 w-4 text-emerald-500" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="glass-effect hover:bg-red-500/10 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle>投稿の削除</AlertDialogTitle>
                    <AlertDialogDescription>
                      この投稿を削除してもよろしいですか？この操作は取り消せません。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="glass-effect">キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(post.id)}
                      className="bg-red-500 hover:bg-red-600 transition-colors duration-200"
                    >
                      削除する
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap leading-relaxed text-lg">
            {post.content}
          </p>
        </CardContent>
      </Card>

      {isEditing && (
        <EditPostDialog
          post={post}
          open={isEditing}
          onOpenChange={setIsEditing}
          onSuccess={(updatedPost) => {
            onUpdate(updatedPost);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}