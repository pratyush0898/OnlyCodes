
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { User, Post } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import PostFeed from '@/components/posts/PostFeed';

// Mock data
const trendingUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    name: 'John Doe',
    bio: 'Frontend developer & React enthusiast',
    avatarUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    followers: 1240,
    following: 350
  },
  {
    id: '2',
    username: 'sarahjohnson',
    name: 'Sarah Johnson',
    bio: 'TypeScript wizard | Building cool stuff',
    avatarUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    followers: 892,
    following: 201
  },
  {
    id: '3',
    username: 'mikecoding',
    name: 'Mike Williams',
    bio: 'Software Engineer | React | Node.js',
    avatarUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    followers: 748,
    following: 182
  },
  {
    id: '4',
    username: 'devemily',
    name: 'Emily Chen',
    bio: 'Full-stack developer | AWS certified',
    avatarUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    followers: 520,
    following: 310
  },
];

const trendingTags = [
  { name: 'typescript', posts: 1420 },
  { name: 'react', posts: 1256 },
  { name: 'javascript', posts: 986 },
  { name: 'nextjs', posts: 752 },
  { name: 'tailwindcss', posts: 645 },
  { name: 'nodejs', posts: 532 },
  { name: 'css', posts: 487 },
  { name: 'webdev', posts: 432 }
];

const trendingPosts: Post[] = [
  {
    id: '101',
    content: "Just discovered this amazing performance optimization technique for React components!",
    codeSnippet: `// Before optimization
const SlowComponent = () => {
  const data = expensiveCalculation();
  return <div>{data}</div>;
};

// After optimization
const FastComponent = () => {
  const data = useMemo(() => {
    return expensiveCalculation();
  }, []);
  return <div>{data}</div>;
};`,
    language: 'jsx',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 328,
    comments: 42,
    user: trendingUsers[0]
  },
  {
    id: '102',
    content: "This CSS trick will save you hours of debugging responsive layouts",
    codeSnippet: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}`,
    language: 'css',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 287,
    comments: 35,
    user: trendingUsers[1]
  },
  {
    id: '103',
    content: "The most underrated TypeScript feature you should be using:",
    codeSnippet: `// Discriminated unions for type-safe state management
type LoadingState = { status: 'loading' };
type SuccessState = { status: 'success'; data: string[] };
type ErrorState = { status: 'error'; error: Error };

type State = LoadingState | SuccessState | ErrorState;

function handleState(state: State) {
  switch (state.status) {
    case 'loading':
      return <Loader />;
    case 'success':
      return <DataList items={state.data} />; // TypeScript knows data exists
    case 'error':
      return <ErrorMessage error={state.error} />; // TypeScript knows error exists
  }
}`,
    language: 'typescript',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 246,
    comments: 28,
    user: trendingUsers[2]
  }
];

const Explore = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>

        <Tabs defaultValue="posts" onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="posts" className="flex-1">Trending Posts</TabsTrigger>
            <TabsTrigger value="people" className="flex-1">People</TabsTrigger>
            <TabsTrigger value="tags" className="flex-1">Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4 animate-fade-in">
            <PostFeed posts={trendingPosts} />
          </TabsContent>

          <TabsContent value="people" className="space-y-4 animate-fade-in">
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendingUsers.map(user => (
                    <div key={user.id} className="p-4 border border-border rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link to={`/${user.username}`} className="font-medium hover:underline">
                            {user.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          <p className="text-xs mt-1">{user.followers.toLocaleString()} followers</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Follow</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags" className="animate-fade-in">
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {trendingTags.map(tag => (
                    <Link
                      to={`/tag/${tag.name}`}
                      key={tag.name}
                      className="p-3 border border-border rounded-lg hover:border-primary transition-colors"
                    >
                      <p className="font-medium">#{tag.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tag.posts.toLocaleString()} posts
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Explore;
