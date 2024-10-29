export const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
];

export const MOCK_CATEGORIES = [
  { id: '1', name: 'お知らせ', color: 'emerald' },
  { id: '2', name: 'イベント', color: 'blue' },
  { id: '3', name: '重要', color: 'red' },
  { id: '4', name: '社内制度', color: 'purple' },
  { id: '5', name: 'その他', color: 'gray' },
];

// ユーザーごとの既読状態を管理
let readStatus: Record<string, string[]> = {
  '1': [], // ユーザーIDをキーに、既読した投稿IDの配列を保持
};

export const MOCK_POSTS = [
  {
    id: '1',
    title: 'Welcome to Our New Platform',
    content: "We're excited to launch our new company bulletin board system. This platform will help us stay connected and share important updates.",
    author: MOCK_USERS[0],
    category: MOCK_CATEGORIES[0],
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Upcoming Team Building Event',
    content: "Join us for a virtual team building session next Friday. We'll have fun activities and prizes!",
    author: MOCK_USERS[1],
    category: MOCK_CATEGORIES[1],
    createdAt: '2024-03-19T15:30:00Z',
    updatedAt: '2024-03-19T15:30:00Z',
  },
];

export const mockLogin = (email: string, password: string) => {
  const user = MOCK_USERS.find(u => u.email === email);
  if (user && password === 'password') {
    return { token: 'mock-token', user };
  }
  throw new Error('Invalid credentials');
};

let posts = [...MOCK_POSTS];

export const mockPosts = {
  getAll: () => posts.map(post => ({
    ...post,
    isRead: readStatus['1']?.includes(post.id) || false,
  })),

  create: (data: any) => {
    const newPost = {
      id: String(posts.length + 1),
      ...data,
      author: MOCK_USERS[0],
      category: MOCK_CATEGORIES.find(c => c.id === data.categoryId) || MOCK_CATEGORIES[4],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRead: false,
    };
    posts = [newPost, ...posts];
    return newPost;
  },

  update: (id: string, data: any) => {
    posts = posts.map(post =>
      post.id === id
        ? {
            ...post,
            ...data,
            category: MOCK_CATEGORIES.find(c => c.id === data.categoryId) || post.category,
            updatedAt: new Date().toISOString(),
          }
        : post
    );
    return posts.find(post => post.id === id);
  },

  delete: (id: string) => {
    posts = posts.filter(post => post.id !== id);
    // 既読状態からも削除
    readStatus['1'] = readStatus['1'].filter(postId => postId !== id);
  },

  markAsRead: (postId: string) => {
    if (!readStatus['1'].includes(postId)) {
      readStatus['1'].push(postId);
    }
    return mockPosts.getAll();
  },

  markAsUnread: (postId: string) => {
    readStatus['1'] = readStatus['1'].filter(id => id !== postId);
    return mockPosts.getAll();
  },
};