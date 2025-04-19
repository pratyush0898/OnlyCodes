import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: ReactNode;
  showRightSidebar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showRightSidebar = true 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex container mx-auto pt-16 pb-4 min-h-[100svh]">
        {!isMobile && (
          <div className="w-64 shrink-0 sticky top-16 h-[calc(100svh-4rem)]">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 px-4">{children}</main>
        {!isMobile && showRightSidebar && (
          <div className="w-72 shrink-0 sticky top-16 h-[calc(100svh-4rem)]">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
