
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const RightSidebar = () => {
  // Placeholder data
  const suggestedUsers = [
    {
      username: 'sarahjohnson',
      name: 'Sarah Johnson',
      avatarUrl: '',
    },
    {
      username: 'mikecoding',
      name: 'Mike Williams',
      avatarUrl: '',
    },
    {
      username: 'devemily',
      name: 'Emily Chen',
      avatarUrl: '',
    },
  ];

  const trendingTopics = [
    { name: 'React', posts: 1420 },
    { name: 'TypeScript', posts: 892 },
    { name: 'Next.js', posts: 654 },
    { name: 'CSS', posts: 521 },
  ];

  return (
    <div className="p-4 space-y-6">
      <Card className="p-4 overflow-hidden">
        <h2 className="font-semibold mb-4">Who to follow</h2>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.username} className="flex items-center justify-between">
              <Link to={`/${user.username}`} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
              </Link>
              <Button variant="outline" size="sm">Follow</Button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link to="/explore" className="text-sm text-primary">
            Show more
          </Link>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-4">Trending</h2>
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <Link 
              to={`/tag/${topic.name.toLowerCase()}`}
              key={topic.name}
              className="block"
            >
              <p className="text-sm font-medium">#{topic.name}</p>
              <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
            </Link>
          ))}
        </div>
      </Card>
      
      <div className="text-xs text-muted-foreground mt-4 space-x-2">
        <Link to="/terms" className="hover:underline">Terms</Link>
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        <Link to="/cookies" className="hover:underline">Cookies</Link>
        <p className="inline">© 2024 OnlyCodes</p>
      </div>
    </div>
  );
};

export default RightSidebar;
