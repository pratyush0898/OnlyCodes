
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import PostFeed from '@/components/posts/PostFeed';
import { User } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { userService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError
  } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => userService.getUserProfile(username || ''),
    enabled: !!username,
  });

  const {
    data: postsData,
    isLoading: isPostsLoading,
  } = useQuery({
    queryKey: ['userPosts', username, activeTab],
    queryFn: () => {
      if (activeTab === 'posts') {
        return userService.getUserPosts(username || '');
      } else {
        return userService.getUserLikedPosts(username || '');
      }
    },
    enabled: !!username && !!profile,
  });
  
  useEffect(() => {
    // Check if current user is following the profile user
    const checkFollowStatus = async () => {
      if (user && profile && user.id !== profile.id) {
        try {
          const following = await userService.isFollowing(user.id, profile.id);
          setIsFollowing(following);
        } catch (error) {
          console.error('Error checking follow status:', error);
        }
      }
    };

    checkFollowStatus();
  }, [user, profile]);

  const toggleFollow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users.",
        variant: "destructive"
      });
      return;
    }
    
    if (!profile) return;
    
    try {
      setIsFollowingLoading(true);
      
      if (isFollowing) {
        await userService.unfollowUser(user.id, profile.id);
        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: `You've unfollowed ${profile.name}`
        });
      } else {
        await userService.followUser(user.id, profile.id);
        setIsFollowing(true);
        toast({
          title: "Following",
          description: `You're now following ${profile.name}`
        });
      }
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating follow status.",
        variant: "destructive"
      });
    } finally {
      setIsFollowingLoading(false);
    }
  };

  if (isProfileLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (profileError || !profile) {
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
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback className="text-2xl">{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                  
                  {profile.bio && <p className="my-3">{profile.bio}</p>}
                  
                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start mt-3">
                    <div>
                      <span className="font-medium">{profile.following}</span>
                      <span className="text-muted-foreground ml-1">Following</span>
                    </div>
                    <div>
                      <span className="font-medium">{profile.followers}</span>
                      <span className="text-muted-foreground ml-1">Followers</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  {user && user.id !== profile.id && (
                    <Button 
                      onClick={toggleFollow}
                      variant={isFollowing ? "outline" : "default"}
                      disabled={isFollowingLoading}
                    >
                      {isFollowingLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                  
                  {user && user.id === profile.id && (
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/settings')}
                    >
                      Edit Profile
                    </Button>
                  )}
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
            {isPostsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : postsData?.posts.length ? (
              <PostFeed posts={postsData.posts} />
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">{profile.name} hasn't posted anything yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="likes" className="mt-4 animate-fade-in">
            {isPostsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : postsData?.posts.length ? (
              <PostFeed posts={postsData.posts} />
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">{profile.name} hasn't liked any posts yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
