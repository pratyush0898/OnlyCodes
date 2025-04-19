
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import jsx from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, MessageSquare, Share } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Post } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { postService } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', jsx);

interface PostCardProps {
  post: Post;
  onLike?: (postId: string, liked: boolean) => void;
}

const PostCard = ({ post, onLike }: PostCardProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  useEffect(() => {
    // Check if the current user has liked this post
    const checkLikeStatus = async () => {
      try {
        if (user) {
          const isLiked = await postService.isPostLiked(post.id, user.id);
          setLiked(isLiked);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [post.id, user]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLikeLoading(true);
      
      if (liked) {
        await postService.unlikePost(post.id, user.id);
        setLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        await postService.likePost(post.id, user.id);
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
      
      if (onLike) {
        onLike(post.id, !liked);
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      toast({
        title: "Error",
        description: "There was an error updating the like status.",
        variant: "destructive"
      });
    } finally {
      setIsLikeLoading(false);
    }
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
                <SyntaxHighlighter
                  language={post.language || 'typescript'}
                  style={vs2015}
                  customStyle={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  {post.codeSnippet}
                </SyntaxHighlighter>
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
          disabled={isLikeLoading}
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
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
            toast({
              title: "Link copied",
              description: "Post link copied to clipboard."
            });
          }}
        >
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
