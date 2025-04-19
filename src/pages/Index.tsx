
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PostFeed from '@/components/posts/PostFeed';
import CreatePostForm from '@/components/posts/CreatePostForm';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { postService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [feed, setFeed] = useState<'following' | 'foryou'>('following');
  const [page, setPage] = useState(1);
  
  // Query for posts
  const {
    data: postsData,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['posts', feed, page],
    queryFn: async () => {
      if (!user) return { posts: [], count: 0 };
      
      if (feed === 'following') {
        return postService.getFollowingPosts(user.id, page);
      } else {
        return postService.getForYouPosts(user.id, page);
      }
    },
    enabled: !!user,
  });
  
  const posts = postsData?.posts || [];
  const totalPosts = postsData?.count || 0;
  const hasMore = posts.length < totalPosts;
  
  // Refetch when feed type changes
  useEffect(() => {
    refetch();
  }, [feed, refetch]);
  
  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-4">Home</h1>
          
          <Tabs defaultValue="following" onValueChange={(v) => {
            setFeed(v as 'following' | 'foryou');
            setPage(1);
          }}>
            <TabsList className="w-full">
              <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
              <TabsTrigger value="foryou" className="flex-1">For You</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mb-6">
          <CreatePostForm />
        </div>

        {isLoading ? (
          <div className="py-10 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <>
            <PostFeed posts={posts} />
            {hasMore && (
              <div className="flex justify-center mt-6 mb-10">
                <Button 
                  variant="outline" 
                  onClick={loadMore}
                  disabled={isFetching}
                >
                  {isFetching ? 'Loading...' : 'Load more'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <h3 className="font-semibold text-xl mb-2">No posts yet</h3>
            {feed === 'following' ? (
              <p className="text-muted-foreground mb-4">
                Follow some developers to see their posts here!
              </p>
            ) : (
              <p className="text-muted-foreground mb-4">
                We're still learning your preferences. Check out the Explore page to find content!
              </p>
            )}
            <Button onClick={() => setFeed(feed === 'following' ? 'foryou' : 'following')}>
              Try {feed === 'following' ? 'For You' : 'Following'} feed
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
