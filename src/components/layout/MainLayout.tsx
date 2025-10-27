import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E6F0F5' }}>
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
