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
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';

  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          <div className={!isAuthPage ? "main-layout" : ""}>
            {!isAuthPage && <Sidebar />}
            <main className={!isAuthPage ? "main-content" : ""}>
              {children}
            </main>
          </div>
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </AuthWrapper>
      </body>
    </html>
  );
}
