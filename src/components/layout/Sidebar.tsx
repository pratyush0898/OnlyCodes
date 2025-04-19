
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home,
  Search,
  User,
  Settings,
  Plus,
  Code,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Search },
    { 
      name: 'Profile', 
      href: profile?.username ? `/${profile.username}` : '#', 
      icon: User 
    },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="py-4 flex flex-col h-full">
      <nav className="space-y-1 flex-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg',
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-4">
          <Button asChild className="w-full justify-start gap-2">
            <Link to="/post/new">
              <Plus className="h-5 w-5" />
              New Post
            </Link>
          </Button>
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="px-3 py-2">
          <h2 className="mb-2 text-xs font-semibold text-muted-foreground">
            Trending Tags
          </h2>
          <div className="space-y-1">
            <Link 
              to="/tag/react" 
              className="block text-sm hover:text-primary"
            >
              #react
            </Link>
            <Link 
              to="/tag/typescript" 
              className="block text-sm hover:text-primary"
            >
              #typescript
            </Link>
            <Link 
              to="/tag/tailwind" 
              className="block text-sm hover:text-primary"
            >
              #tailwind
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
