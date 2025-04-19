import { supabase } from '@/integrations/supabase/client';
import { Post, User } from '@/types';

// Post services
export const postService = {
  async getPosts(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        user:profiles(*),
        likes:likes(count),
        comments:comments(count)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
      
    if (error) {
      throw error;
    }
    
    // Process post data to match our frontend types
    const posts = data?.map(post => ({
      ...post,
      user: {
        id: post.user.id,
        username: post.user.username,
        name: post.user.name,
        bio: post.user.bio || '',
        avatarUrl: post.user.avatar_url || '',
        createdAt: post.user.created_at,
        updatedAt: post.user.updated_at
      },
      likes: post.likes.length > 0 ? post.likes[0].count : 0,
      comments: post.comments.length > 0 ? post.comments[0].count : 0,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    })) || [];
    
    return { posts, count: count || 0 };
  },

  async getForYouPosts(userId: string, page = 1, limit = 10) {
    // Get posts based on user's preferences
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('preferred_tags, preferred_languages')
      .eq('user_id', userId)
      .single();
      
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    let query = supabase
      .from('posts')
      .select(`
        *,
        user:profiles(*),
        likes:likes(count),
        comments:comments(count),
        post_tags!inner(tag_id)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });
      
    // If user has preferences, filter by them
    if (preferences && preferences.preferred_tags && preferences.preferred_tags.length > 0) {
      query = query.in('post_tags.tag_id', preferences.preferred_tags);
    }
      
    const { data, error, count } = await query.range(from, to);
      
    if (error) {
      throw error;
    }
    
    // Process post data to match our frontend types
    const posts = data?.map(post => ({
      ...post,
      user: {
        id: post.user.id,
        username: post.user.username,
        name: post.user.name,
        bio: post.user.bio || '',
        avatarUrl: post.user.avatar_url || '',
        createdAt: post.user.created_at,
        updatedAt: post.user.updated_at
      },
      likes: post.likes.length > 0 ? post.likes[0].count : 0,
      comments: post.comments.length > 0 ? post.comments[0].count : 0,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    })) || [];
    
    return { posts, count: count || 0 };
  },
  
  async getFollowingPosts(userId: string, page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Get the list of users that the current user follows
    const { data: followings } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);
    
    // Extract the following_id values into an array
    const followingIds = followings?.map(follow => follow.following_id) || [];
    
    // If not following anyone, return empty result
    if (followingIds.length === 0) {
      return { posts: [], count: 0 };
    }
    
    // Fixed: Now using the array of following_ids correctly
    const { data, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        user:profiles!inner(*),
        likes:likes(count),
        comments:comments(count)
      `, { count: 'exact' })
      .in('user_id', followingIds)
      .order('created_at', { ascending: false })
      .range(from, to);
      
    if (error) {
      throw error;
    }
    
    // Process post data to match our frontend types
    const posts = data?.map(post => ({
      ...post,
      user: {
        id: post.user.id,
        username: post.user.username,
        name: post.user.name,
        bio: post.user.bio || '',
        avatarUrl: post.user.avatar_url || '',
        createdAt: post.user.created_at,
        updatedAt: post.user.updated_at
      },
      likes: post.likes.length > 0 ? post.likes[0].count : 0,
      comments: post.comments.length > 0 ? post.comments[0].count : 0,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    })) || [];
    
    return { posts, count: count || 0 };
  },
  
  async createPost(post: {
    content: string;
    code_snippet?: string;
    language?: string;
    media_url?: string;
    media_type?: 'image' | 'video';
    user_id: string;
  }) {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select();
      
    if (error) {
      throw error;
    }
    
    return data[0];
  },
  
  async likePost(postId: string, userId: string) {
    const { error } = await supabase
      .from('likes')
      .insert([{ post_id: postId, user_id: userId }]);
      
    if (error && error.code !== '23505') { // Ignore unique_violation error
      throw error;
    }
  },
  
  async unlikePost(postId: string, userId: string) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .match({ post_id: postId, user_id: userId });
      
    if (error) {
      throw error;
    }
  },
  
  async isPostLiked(postId: string, userId: string) {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .match({ post_id: postId, user_id: userId });
      
    if (error) {
      throw error;
    }
    
    return data.length > 0;
  }
};

// User services
export const userService = {
  async getUserProfile(username: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        followers:follows!follower_id(count),
        following:follows!following_id(count)
      `)
      .eq('username', username)
      .single();
      
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      username: data.username,
      name: data.name,
      bio: data.bio || '',
      avatarUrl: data.avatar_url || '',
      website: data.website || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      followers: data.followers[0]?.count || 0,
      following: data.following[0]?.count || 0
    };
  },
  
  async getUserPosts(username: string, page = 1, limit = 10) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();
      
    if (!profile) {
      throw new Error('User not found');
    }
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        user:profiles(*),
        likes:likes(count),
        comments:comments(count)
      `, { count: 'exact' })
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .range(from, to);
      
    if (error) {
      throw error;
    }
    
    // Process post data to match our frontend types
    const posts = data?.map(post => ({
      ...post,
      user: {
        id: post.user.id,
        username: post.user.username,
        name: post.user.name,
        bio: post.user.bio || '',
        avatarUrl: post.user.avatar_url || '',
        createdAt: post.user.created_at,
        updatedAt: post.user.updated_at
      },
      likes: post.likes.length > 0 ? post.likes[0].count : 0,
      comments: post.comments.length > 0 ? post.comments[0].count : 0,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    })) || [];
    
    return { posts, count: count || 0 };
  },
  
  async getUserLikedPosts(username: string, page = 1, limit = 10) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();
      
    if (!profile) {
      throw new Error('User not found');
    }
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        user:profiles(*),
        likes:likes!inner(count),
        comments:comments(count)
      `, { count: 'exact' })
      .eq('likes.user_id', profile.id)
      .order('created_at', { ascending: false })
      .range(from, to);
      
    if (error) {
      throw error;
    }
    
    // Process post data to match our frontend types
    const posts = data?.map(post => ({
      ...post,
      user: {
        id: post.user.id,
        username: post.user.username,
        name: post.user.name,
        bio: post.user.bio || '',
        avatarUrl: post.user.avatar_url || '',
        createdAt: post.user.created_at,
        updatedAt: post.user.updated_at
      },
      likes: post.likes.length > 0 ? post.likes[0].count : 0,
      comments: post.comments.length > 0 ? post.comments[0].count : 0,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    })) || [];
    
    return { posts, count: count || 0 };
  },
  
  async updateProfile(userId: string, profile: {
    name?: string;
    bio?: string;
    avatar_url?: string;
    website?: string;
  }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select();
      
    if (error) {
      throw error;
    }
    
    return data[0];
  },
  
  async followUser(followerId: string, followingId: string) {
    const { error } = await supabase
      .from('follows')
      .insert([{ follower_id: followerId, following_id: followingId }]);
      
    if (error && error.code !== '23505') { // Ignore unique_violation error
      throw error;
    }
  },
  
  async unfollowUser(followerId: string, followingId: string) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .match({ follower_id: followerId, following_id: followingId });
      
    if (error) {
      throw error;
    }
  },
  
  async isFollowing(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .match({ follower_id: followerId, following_id: followingId });
      
    if (error) {
      throw error;
    }
    
    return data.length > 0;
  },
  
  async updateUserPreferences(userId: string, preferences: {
    preferred_languages?: string[];
    preferred_tags?: string[];
  }) {
    // Check if user has preferences
    const { data: existingPrefs } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId);
      
    if (existingPrefs && existingPrefs.length > 0) {
      // Update existing preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .update(preferences)
        .eq('user_id', userId)
        .select();
        
      if (error) {
        throw error;
      }
      
      return data[0];
    } else {
      // Create new preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .insert([{ user_id: userId, ...preferences }])
        .select();
        
      if (error) {
        throw error;
      }
      
      return data[0];
    }
  },
  
  async getUserPreferences(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // Ignore not found error
      throw error;
    }
    
    return data || { preferred_languages: [], preferred_tags: [] };
  }
};

// Tags service
export const tagService = {
  async getAllTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
      
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  async addTagToPost(postId: string, tagId: string) {
    const { error } = await supabase
      .from('post_tags')
      .insert([{ post_id: postId, tag_id: tagId }]);
      
    if (error && error.code !== '23505') { // Ignore unique_violation error
      throw error;
    }
  },
  
  async getPostTags(postId: string) {
    const { data, error } = await supabase
      .from('post_tags')
      .select('tag:tags(*)')
      .eq('post_id', postId);
      
    if (error) {
      throw error;
    }
    
    return data.map(item => item.tag);
  }
};
