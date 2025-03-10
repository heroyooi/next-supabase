import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.scss';
import Header from '@/components/Header';

const notoSansKR = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'This is my Next.js application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko'>
      <body className={notoSansKR.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
