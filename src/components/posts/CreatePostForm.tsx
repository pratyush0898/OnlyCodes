
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

const CreatePostForm = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!content && !codeSnippet && !media) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here we would:
      // 1. Upload media to Supabase storage if present
      // 2. Create post record in Supabase
      
      // For now we'll just simulate a success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to home feed
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
