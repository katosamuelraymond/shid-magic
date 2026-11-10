import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShidMagic Admin Portal | Executive Operations & Merchant Management',
  description: 'Internal operations dashboard for ShidMagic Kampala marketplace.',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
