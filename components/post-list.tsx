"use client"

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, User, Calendar, Circle } from 'lucide-react';
import { PostDetail } from './post-detail';

const categoryColors: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  red: 'bg-red-500/10 text-red-500 border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  gray: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

interface PostListProps {
  posts: any[];
  onUpdate: (post: any) => void;
  onDelete: (postId: string) => void;
  onReadStatusChange: (postId: string, isRead: boolean) => void;
}

export function PostList({ posts, onUpdate, onDelete, onReadStatusChange }: PostListProps) {
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    if (!post.isRead) {
      onReadStatusChange(post.id, true);
    }
  };

  return (
    <div className="space-y-4">
      {selectedPost ? (
        <PostDetail
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onReadStatusChange={onReadStatusChange}
        />
      ) : (
        <div className="grid gap-4 animate-fade-in">
          {posts.map((post, index) => (
            <Card
              key={post.id}
              className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handlePostClick(post)}
            >
              <CardHeader className="flex flex-row items-start justify-between py-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${categoryColors[post.category.color]} px-2 py-0.5`}>
                      {post.category.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(post.createdAt), 'PPP', { locale: ja })}
                    </span>
                    {!post.isRead && (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        <Circle className="h-2 w-2 fill-current mr-1" /> 未読
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-medium group-hover:text-emerald-500 transition-colors duration-200">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {post.author.name}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground group-hover:text-emerald-500 transition-colors duration-200 mt-2"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}