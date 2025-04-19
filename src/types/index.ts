
export interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  following?: number;
  followers?: number;
}

export interface Post {
  id: string;
  content: string;
  codeSnippet?: string;
  language?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  user: User;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  post?: {
    id: string;
    content: string;
  };
  user: User;
  createdAt: string;
  read: boolean;
}
