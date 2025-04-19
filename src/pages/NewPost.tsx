
import MainLayout from '@/components/layout/MainLayout';
import CreatePostForm from '@/components/posts/CreatePostForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewPost = () => {
  return (
    <MainLayout showRightSidebar={false}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to feed</span>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create Post</CardTitle>
          </CardHeader>
          <CardContent>
            <CreatePostForm />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NewPost;
