'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, useWishlistStore, useUIStore } from '@/stores';

const categories = [
  { name: 'DIY Painting Kits', href: '/products?category=painting' },
  { name: 'Wooden Products', href: '/products?category=wooden' },
  { name: 'Home Decor', href: '/products?category=decor' },
  { name: 'Personalized Gifts', href: '/products?category=gifts' },
  { name: 'Craft Materials', href: '/products?category=crafts' },
  { name: 'Resin Art', href: '/products?category=resin' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const { isMobileMenuOpen, setMobileMenuOpen, isCartDrawerOpen, setCartDrawerOpen, setSearchOpen } =
    useUIStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Categories', href: '/products', hasDropdown: true },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : 'bg-white'
        }`}
      >
        <nav className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2 text-brand-text hover:text-brand-primary transition-colors"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold tracking-tight">
                <span className="text-brand-primary">Ma</span>
                <span className="text-brand-dark">koo</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setShowCategories(true)}
                  onMouseLeave={() => link.hasDropdown && setShowCategories(false)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                        ? 'text-brand-primary'
                        : 'text-brand-text hover:text-brand-primary'
                    }`}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={14} />}
                  </Link>

                  {/* Categories Dropdown */}
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {showCategories && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 pt-2 w-56"
                        >
                          <div className="bg-white rounded-xl shadow-lg border border-brand-gray-dark/30 py-2">
                            {categories.map((category) => (
                              <Link
                                key={category.name}
                                href={category.href}
                                className="block px-4 py-2.5 text-sm text-brand-text-light hover:text-brand-primary hover:bg-brand-gray transition-colors"
                              >
                                {category.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-brand-text-light hover:text-brand-primary transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="/wishlist"
                className="relative p-2 text-brand-text-light hover:text-brand-primary transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {isMounted && wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 text-brand-text-light hover:text-brand-primary transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {isMounted && itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              <Link
                href="/account"
                className="hidden md:block p-2 text-brand-text-light hover:text-brand-primary transition-colors"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-brand-gray-dark/30">
                  <span className="text-xl font-bold">
                    <span className="text-brand-primary">Ma</span>
                    <span className="text-brand-dark">koo</span>
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-brand-text-light hover:text-brand-primary"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-base font-medium transition-colors ${
                        pathname === link.href
                          ? 'text-brand-primary bg-brand-primary/5'
                          : 'text-brand-text hover:text-brand-primary hover:bg-brand-gray'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="mt-4 pt-4 border-t border-brand-gray-dark/30">
                    <p className="px-4 py-2 text-xs font-semibold text-brand-text-muted uppercase tracking-wider">
                      Categories
                    </p>
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-brand-text-light hover:text-brand-primary hover:bg-brand-gray transition-colors pl-8"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </nav>

                <div className="p-4 border-t border-brand-gray-dark/30">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary w-full justify-center"
                  >
                    <User size={18} />
                    My Account
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
