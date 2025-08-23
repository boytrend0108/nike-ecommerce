import { Footer, Navbar } from '@/components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nike',
  description: 'An e-commerce platform for Nike products',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
