
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NewPost from "./pages/NewPost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import PrivateRoute from "./components/auth/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/welcome" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
            <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/post/new" element={<PrivateRoute><NewPost /></PrivateRoute>} />
            
            {/* Public but with auth check */}
            <Route path="/:username" element={<Profile />} />
            
            {/* Auth redirects */}
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
