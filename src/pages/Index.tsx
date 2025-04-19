
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PostFeed from '@/components/posts/PostFeed';
import CreatePostForm from '@/components/posts/CreatePostForm';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

const mockPosts: Post[] = [
  {
    id: '1',
    content: "Just figured out a clean way to handle authentication in React with custom hooks! Game-changer for my workflow.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 24,
    comments: 5,
    user: {
      id: '1',
      username: 'johndoe',
      name: 'John Doe',
      bio: 'Frontend developer & React enthusiast',
      avatarUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    id: '2',
    content: "Check out this TypeScript utility type I created for deep readonly objects:",
    codeSnippet: `type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

// Usage:
interface User {
  name: string;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  }
}

const user: DeepReadonly<User> = {
  name: 'John',
  settings: {
    theme: 'dark',
    notifications: true
  }
};`,
    language: 'typescript',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 42,
    comments: 7,
    user: {
      id: '2',
      username: 'sarahjohnson',
      name: 'Sarah Johnson',
      bio: 'TypeScript wizard | Building cool stuff',
      avatarUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    id: '3',
    content: "I'm loving the new React 18 features. Concurrent rendering is a game-changer for complex UIs!",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    likes: 18,
    comments: 3,
    user: {
      id: '3',
      username: 'mikecoding',
      name: 'Mike Williams',
      bio: 'Software Engineer | React | Node.js',
      avatarUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
];

const Index = () => {
  const isMobile = useIsMobile();
  const [feed, setFeed] = useState<'following' | 'foryou'>('following');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading posts from API
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [feed]);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-4">Home</h1>
          
          <Tabs defaultValue="following" onValueChange={(v) => setFeed(v as 'following' | 'foryou')}>
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
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : (
          <PostFeed posts={posts} />
        )}

        {posts.length > 0 && (
          <div className="flex justify-center mt-6 mb-10">
            <Button variant="outline">Load more</Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
