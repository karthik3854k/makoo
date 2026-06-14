import type { Metadata } from 'next';
import './globals.css';
import NavbarFooter from '@/components/ui/loading';
import SearchModal from '@/components/common/SearchModal';
import CartDrawer from '@/components/cart/CartDrawer';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Makoo - DIY Customization Products',
  description: 'Create beautiful personalized products with our DIY kits. Shop painting kits, wooden products, home decor, and personalized gifts.',
  keywords: ['DIY', 'customization', 'personalized gifts', 'home decor', 'craft materials', 'resin art'],
  authors: [{ name: 'Makoo' }],
  creator: 'Makoo',
  publisher: 'Makoo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://makoo.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Makoo - DIY Customization Products',
    description: 'Create beautiful personalized products with our DIY kits.',
    url: 'https://makoo.com',
    siteName: 'Makoo',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Makoo - DIY Customization Products',
    description: 'Create beautiful personalized products with our DIY kits.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <NavbarFooter />
        <SearchModal />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
