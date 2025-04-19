
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, MessageSquare, Share } from 'lucide-react';
import { Post } from '@/types';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes);

  // When component mounts, highlight code blocks
  useEffect(() => {
    if (post.codeSnippet) {
      setTimeout(() => {
        Prism.highlightAll();
      }, 0);
    }
  }, [post.codeSnippet]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(likeCount + (liked ? -1 : 1));
    // Here you would make API call to Supabase to update likes
  };

  return (
    <Card className="mb-4 overflow-hidden card-hover">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Link to={`/${post.user.username}`}>
            <Avatar>
              <AvatarImage src={post.user.avatarUrl} alt={post.user.name} />
              <AvatarFallback>{post.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <Link to={`/${post.user.username}`} className="hover:underline">
                <span className="font-medium">{post.user.name}</span>
                <span className="text-muted-foreground ml-1">@{post.user.username}</span>
              </Link>
              <span className="text-xs text-muted-foreground">
                {format(new Date(post.createdAt), 'MMM d')}
              </span>
            </div>

            <div className="mt-2 break-words">
              <p>{post.content}</p>
            </div>

            {post.codeSnippet && (
              <div className="mt-3 overflow-hidden rounded-lg">
                <pre className="code-block" data-language={post.language || 'typescript'}>
                  <code className={`language-${post.language || 'typescript'}`}>
                    {post.codeSnippet}
                  </code>
                </pre>
              </div>
            )}

            {post.mediaUrl && (
              <div className="mt-3">
                {post.mediaType === 'image' ? (
                  <img 
                    src={post.mediaUrl} 
                    alt="Post attachment" 
                    className="rounded-lg w-full h-auto max-h-96 object-cover" 
                  />
                ) : (
                  <video 
                    src={post.mediaUrl} 
                    controls 
                    className="rounded-lg w-full h-auto max-h-96" 
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 border-t border-border flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn("gap-1", liked && "text-red-500")}
          onClick={handleLike}
        >
          <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
          <span>{likeCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link to={`/post/${post.id}`}>
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments}</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
