import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShidMagic Operations | HR & Enterprise Management',
  description: 'Enterprise internal management system for ShidMagic Kampala marketplace.',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
