import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'components/providers/SessionProvider';
import { ThemeProvider } from 'components/common/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'POS System',
  description: 'Point of Sale System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
} 