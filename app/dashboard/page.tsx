"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, Search } from 'lucide-react';
import { PostList } from '@/components/post-list';
import { CreatePostDialog } from '@/components/create-post-dialog';
import { mockPosts } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DashboardPage() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [posts, setPosts] = useState(mockPosts.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [readFilter, setReadFilter] = useState<string>('all');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    let filtered = posts.filter(post => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = post.title.toLowerCase().includes(query) ||
                          post.content.toLowerCase().includes(query);
      
      switch (readFilter) {
        case 'unread':
          return matchesSearch && !post.isRead;
        case 'read':
          return matchesSearch && post.isRead;
        default:
          return matchesSearch;
      }
    });
    setFilteredPosts(filtered);
  }, [searchQuery, posts, readFilter]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleCreateSuccess = (newPost: any) => {
    setPosts([newPost, ...posts]);
    setIsCreateOpen(false);
  };

  const handleUpdatePost = (updatedPost: any) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleReadStatusChange = (postId: string, isRead: boolean) => {
    const updatedPosts = isRead ? 
      mockPosts.markAsRead(postId) : 
      mockPosts.markAsUnread(postId);
    setPosts(updatedPosts);
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-green-900/30 backdrop-blur-sm"></div>
      
      <header className="sticky top-0 z-50 glass-effect border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
            社内掲示板
          </h1>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 transition-all duration-300 gap-2"
            >
              <Plus className="h-4 w-4" /> 新規投稿
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="glass-effect hover:bg-white/10 transition-all duration-300 gap-2"
            >
              <LogOut className="h-4 w-4" /> ログアウト
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="タイトルや内容で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-input"
              />
            </div>
            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger className="w-[140px] glass-input">
                <SelectValue placeholder="表示する投稿" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての投稿</SelectItem>
                <SelectItem value="unread">未読の投稿</SelectItem>
                <SelectItem value="read">既読の投稿</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? '検索結果が見つかりませんでした' : '投稿がありません'}
              </p>
            </div>
          ) : (
            <PostList 
              posts={filteredPosts} 
              onUpdate={handleUpdatePost}
              onDelete={handleDeletePost}
              onReadStatusChange={handleReadStatusChange}
            />
          )}
        </div>
      </main>

      <CreatePostDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}