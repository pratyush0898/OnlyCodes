
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import PostFeed from '@/components/posts/PostFeed';
import { User, Post } from '@/types';
import { ArrowLeft } from 'lucide-react';

const mockUser: User = {
  id: '1',
  username: 'johndoe',
  name: 'John Doe',
  bio: 'Frontend Developer & React Enthusiast | Building user-friendly interfaces | TypeScript lover | Open source contributor',
  avatarUrl: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  followers: 1240,
  following: 350
};

const mockPosts: Post[] = [
  {
    id: '1',
    content: "Just figured out a clean way to handle authentication in React with custom hooks! Game-changer for my workflow.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 24,
    comments: 5,
    user: mockUser
  },
  {
    id: '2',
    content: "Here's a useful TypeScript snippet for handling API responses:",
    codeSnippet: `// Define a generic API response type
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// Use it with any data type
async function fetchUsers(): Promise<ApiResponse<User[]>> {
  const response = await fetch('/api/users');
  return response.json();
}

// Now TypeScript knows the exact shape of your data!
const { data: users, status } = await fetchUsers();`,
    language: 'typescript',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 35,
    comments: 8,
    user: mockUser
  }
];

const mockLikedPosts: Post[] = [
  {
    id: '101',
    content: "Refactoring an old project with the new React patterns and it feels like upgrading from a bicycle to a Tesla!",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    likes: 78,
    comments: 12,
    user: {
      id: '2',
      username: 'sarahjohnson',
      name: 'Sarah Johnson',
      bio: 'TypeScript wizard | Building cool stuff',
      avatarUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
];

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to get user profile
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, we'd fetch based on username
        setUser(mockUser);
        setPosts(mockPosts);
        setLikedPosts(mockLikedPosts);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    // In a real app, we'd make an API call to follow/unfollow
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-10">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-10">
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <p className="text-muted-foreground mb-4">The profile you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go back home
            </a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                  
                  <p className="my-3">{user.bio}</p>
                  
                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                    <div>
                      <span className="font-medium">{user.following}</span>
                      <span className="text-muted-foreground ml-1">Following</span>
                    </div>
                    <div>
                      <span className="font-medium">{user.followers}</span>
                      <span className="text-muted-foreground ml-1">Followers</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button 
                    onClick={toggleFollow}
                    variant={isFollowing ? "outline" : "default"}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
            <TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-4 animate-fade-in">
            {posts.length > 0 ? (
              <PostFeed posts={posts} />
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">{user.name} hasn't posted anything yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="likes" className="mt-4 animate-fade-in">
            {likedPosts.length > 0 ? (
              <PostFeed posts={likedPosts} />
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">{user.name} hasn't liked any posts yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
