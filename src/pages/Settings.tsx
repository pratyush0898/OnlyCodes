
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileForm from '@/components/settings/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/welcome');
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto pb-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information that is visible to others.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account settings and email preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Email Address</h3>
                  <p className="text-muted-foreground mb-4">{user?.email}</p>
                  <Button variant="outline">Change Email</Button>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Password</h3>
                  <p className="text-muted-foreground mb-4">
                    Change your password to keep your account secure.
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
                  <p className="text-muted-foreground mb-4">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
                    <Button variant="outline" className="text-destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your experience and notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Content Preferences</h3>
                    <p className="text-muted-foreground mb-2">
                      Select topics that interest you to get personalized recommendations.
                    </p>
                    <Button variant="outline">Manage Interests</Button>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Email Notifications</h3>
                    <p className="text-muted-foreground mb-2">
                      Configure what types of events you'd like to receive email notifications for.
                    </p>
                    <Button variant="outline">Manage Notifications</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
