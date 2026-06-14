'use client';

import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/layout/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: false });

export default function NavbarFooter() {
  return (
    <>
      <Navbar />
      <Footer />
    </>
  );
}
