import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '600', '900'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['800'],
});

export const metadata: Metadata = {
  title: '난소암 CDSS | 조기진단 임상의사결정지원 시스템',
  description: 'AI 기반 멀티모달 난소암 조기진단 임상의사결정지원 시스템',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
