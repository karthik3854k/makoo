'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore } from '@/stores';
import { productService } from '@/services/frappe';
import type { Product } from '@/types';

const popularSearches = [
  'DIY Painting Kit',
  'Personalized Name Board',
  'Resin Art Kit',
  'Wooden Photo Frame',
  'Handmade Gift',
];

export default function SearchModal() {
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await productService.getList({ search: searchQuery, page_length: 8 });
      setResults(response.message?.items || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, performSearch]);

  const handleClose = () => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute top-0 left-0 right-0 bg-white shadow-2xl"
          >
            <div className="section-container py-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-12 py-4 text-lg bg-brand-gray rounded-xl border border-transparent focus:border-brand-primary focus:outline-none transition-colors"
                />
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="mt-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : query && results.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                    {results.map((product) => (
                      <Link
                        key={product.item_code}
                        href={`/product/${product.item_code}`}
                        onClick={handleClose}
                        className="group flex gap-3 p-2 -mx-2 rounded-lg hover:bg-brand-gray transition-colors"
                      >
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-brand-gray shrink-0">
                          <Image
                            src={product.image || product.website_image || ''}
                            alt={product.item_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-brand-dark line-clamp-2 group-hover:text-brand-primary transition-colors">
                            {product.item_name}
                          </h4>
                          <p className="text-sm font-semibold text-brand-primary mt-1">
                            Rs. {product.price.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : query && results.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-brand-text-light">No products found for "{query}"</p>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="flex items-center gap-2 text-brand-text-muted mb-4">
                      <TrendingUp size={16} />
                      <span className="text-sm font-medium">Popular Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => setQuery(search)}
                          className="px-4 py-2 bg-brand-gray rounded-full text-sm text-brand-text-light hover:bg-brand-gray-dark transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
