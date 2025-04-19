
import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Image, Code, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { postService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_BUCKET = 'post-media';

const CreatePostForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!content && !codeSnippet && !media) {
      toast({
        title: "Error",
        description: "Please add some content to your post.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create posts.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let mediaUrl = '';
      let mediaType = null;
      
      // Upload media if present
      if (media) {
        const fileExt = media.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        mediaType = media.type.startsWith('image/') ? 'image' : 'video';
        
        const { error: uploadError, data } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, media, {
            upsert: true,
            onUploadProgress: (progress) => {
              const percent = (progress.loaded / progress.total) * 100;
              setMediaUploadProgress(Math.round(percent));
            }
          });
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filePath);
          
        mediaUrl = publicUrl;
      }
      
      // Create post in database
      await postService.createPost({
        content,
        code_snippet: codeSnippet || undefined,
        language: codeSnippet ? language : undefined,
        media_url: mediaUrl || undefined,
        media_type: mediaType as 'image' | 'video' | undefined,
        user_id: user.id
      });
      
      toast({
        title: "Success",
        description: "Your post has been created."
      });
      
      // Reset form
      setContent('');
      setCodeSnippet('');
      setShowCodeEditor(false);
      removeMedia();
      
      // Redirect to home feed
      navigate('/');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating your post.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setMediaUploadProgress(0);
    }
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "The file size should not exceed 10MB.",
        variant: "destructive"
      });
      return;
    }

    setMedia(file);
    
    // Create preview URL
    const preview = URL.createObjectURL(file);
    setMediaPreview(preview);
  };

  const removeMedia = () => {
    setMedia(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }
  };

  const toggleCodeEditor = () => {
    setShowCodeEditor(!showCodeEditor);
    if (!showCodeEditor) {
      // Focus the code editor when showing it
      setTimeout(() => {
        document.getElementById('code-editor')?.focus();
      }, 0);
    }
  };

  const languages = [
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'jsx', label: 'JSX' },
    { value: 'tsx', label: 'TSX' },
    { value: 'css', label: 'CSS' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
  ];

  if (!user) {
    return (
      <Card className="p-4 text-center">
        <p className="text-muted-foreground mb-2">Please sign in to create posts.</p>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Share your code thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
          />

          {showCodeEditor && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCodeEditor(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
              <Textarea
                id="code-editor"
                placeholder="Paste your code here..."
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="font-mono min-h-[150px]"
              />
            </div>
          )}

          {mediaPreview && (
            <div className="relative">
              {media?.type.startsWith('image/') ? (
                <img
                  src={mediaPreview}
                  alt="Upload preview"
                  className="mt-2 rounded-lg max-h-64 w-auto"
                />
              ) : (
                <video
                  src={mediaPreview}
                  controls
                  className="mt-2 rounded-lg max-h-64 w-full"
                />
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={removeMedia}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {mediaUploadProgress > 0 && mediaUploadProgress < 100 && (
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${mediaUploadProgress}%` }}
              ></div>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-border">
            <div className="flex gap-2">
              {!showCodeEditor && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleCodeEditor}
                  title="Add code snippet"
                >
                  <Code className="h-5 w-5" />
                </Button>
              )}

              {!mediaPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => document.getElementById('media-upload')?.click()}
                  title="Add media"
                >
                  <Image className="h-5 w-5" />
                  <Input
                    id="media-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                </Button>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || (!content && !codeSnippet && !media)}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default CreatePostForm;
