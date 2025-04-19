
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';

const AVATAR_BUCKET = 'avatars';

const ProfileForm = () => {
  const { user, profile } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBio(profile.bio || '');
      setWebsite(profile.website || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);
  
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Avatar image should be less than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setAvatarFile(file);
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update your profile",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let newAvatarUrl = avatarUrl;
      
      // Upload avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from(AVATAR_BUCKET)
          .upload(fileName, avatarFile, { upsert: true });
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(AVATAR_BUCKET)
          .getPublicUrl(fileName);
          
        newAvatarUrl = publicUrl;
      }
      
      // Update profile
      await userService.updateProfile(user.id, {
        name,
        bio,
        website,
        avatar_url: newAvatarUrl
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            {name ? name.substring(0, 2).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <Label htmlFor="avatar" className="cursor-pointer">
            <Button type="button" variant="outline" size="sm">
              Change Avatar
            </Button>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself"
          className="resize-none"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://example.com"
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};

export default ProfileForm;
