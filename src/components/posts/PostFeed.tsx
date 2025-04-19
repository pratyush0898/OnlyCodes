
import { Post } from '@/types';
import PostCard from './PostCard';
import { useState } from 'react';

interface PostFeedProps {
  posts: Post[];
}

const PostFeed = ({ posts }: PostFeedProps) => {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handlePostLike = (postId: string, liked: boolean) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: liked
    }));
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-center text-muted-foreground">
          No posts to display.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={{
            ...post,
            isLiked: likedPosts[post.id] !== undefined ? likedPosts[post.id] : post.isLiked
          }}
          onLike={handlePostLike}
        />
      ))}
    </div>
  );
};

export default PostFeed;
