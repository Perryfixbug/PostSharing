import type { Metadata } from 'next';
import AuthProvider from '@/context/authContext';
import NavigationMenu from '@/components/navigation-menu';
import RightSide from '@/app/extension-side';
import { Toaster } from 'sonner';
import { Open_Sans as FontSans } from 'next/font/google';
import './globals.css';
import SocketProvider from '@/context/websocketContext';
import ChatProvider from '@/context/chatContext';
import NotiProvider from '@/context/notiContext';
import { ThemeProvider } from '@/context/themeContext';
import LoadingProvider from '@/context/loadingContext';
import TopMenu from '@/components/top-menu';

const fontSans = FontSans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QuacQuac - Share everything excited',
  description: 'Social media sharing post, chat, excited story',
  icons: {
    icon: '/duck-svgrepo-com.svg',
    shortcut: '/duck-svgrepo-com.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.className} fontSans antialiased`}>
        <LoadingProvider>
          <AuthProvider>
            <SocketProvider>
              <NotiProvider>
                <ChatProvider>
                  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <main className="w-full min-h-screen grid grid-cols-8">
                      <NavigationMenu />
                      <TopMenu />
                      <div className="container col-span-12 md:col-span-4 md:col-start-3 p-10 min-w-sm mt-20 md:mt-0">
                        {children}
                      </div>
                      <RightSide />
                    </main>
                    <Toaster closeButton visibleToasts={3} duration={8000} />
                  </ThemeProvider>
                </ChatProvider>
              </NotiProvider>
            </SocketProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
