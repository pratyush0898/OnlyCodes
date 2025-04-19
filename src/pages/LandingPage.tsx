
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Code, Users, Heart, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // If user is already logged in, redirect to home
  if (user) {
    navigate('/');
    return null;
  }

  const features = [
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Share Code Snippets",
      description: "Share and discuss code with developers around the world."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Connect with Developers",
      description: "Build your network with like-minded developers in your field."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Discover Great Content",
      description: "Find posts tailored to your programming interests."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Engage in Discussions",
      description: "Participate in meaningful technical conversations."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 z-0" />
        
        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Where developers share
                <span className="text-primary"> code</span> and build
                <span className="text-primary"> connections</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Join a community of developers to share snippets, knowledge, and grow your network.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/signup')} className="text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="text-lg">
                  Sign In
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/2 lg:pl-10">
              <div className="rounded-lg overflow-hidden border border-border shadow-xl bg-card/50 backdrop-blur">
                <div className="p-4 border-b border-border flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="ml-2 text-sm font-mono text-muted-foreground">typescript</div>
                </div>
                <pre className="p-4 text-sm md:text-base font-mono overflow-x-auto">
                  <code className="language-typescript">
{`// Welcome to OnlyCodes
function calculateEngagement(post) {
  return {
    reach: post.likes * 2 + post.comments * 3,
    impact: post.shares * 5,
    community: post.followers.growth()
  };
}

// Join us today! 
// Share your knowledge and grow your network.`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Developers Love OnlyCodes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-background rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-3 bg-secondary rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to join the community?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Create an account today and start sharing your code, connecting with other developers,
            and discovering great content tailored to your interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => navigate('/signup')} className="text-lg">
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-secondary/50 py-10 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-primary">&lt;/&gt;</span>
              <span className="text-lg font-semibold">OnlyCodes</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} OnlyCodes. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
