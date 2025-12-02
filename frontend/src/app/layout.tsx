'use client';

import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthWrapper from "@/components/AuthWrapper";
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          <div style={{ display: 'flex' }}>
            {!isAuthPage && <Sidebar />}
            <main style={{ 
              flex: 1, 
              marginLeft: isAuthPage ? 0 : 'var(--sidebar-width)', 
              minHeight: '100vh',
              padding: isAuthPage ? 0 : '2rem'
            }}>
              {children}
            </main>
          </div>
          <Toaster position="top-center" />
        </AuthWrapper>
      </body>
    </html>
  );
}
