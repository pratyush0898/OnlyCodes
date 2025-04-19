
import { Post } from '@/types';
import PostCard from './PostCard';

interface PostFeedProps {
  posts: Post[];
}

const PostFeed = ({ posts }: PostFeedProps) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-center text-muted-foreground">
          No posts to display. Follow some developers to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
