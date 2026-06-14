'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useWishlistStore } from '@/stores';
import { productService } from '@/services/frappe';
import type { Product } from '@/types';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // In real app, fetch each product by item_code
        // For demo, use mock products
        const mockProducts: Product[] = items.slice(0, 6).map((item, idx) => ({
          name: `Product ${idx + 1}`,
          item_code: item.item_code,
          item_name: `Wishlist Item ${idx + 1}`,
          description: 'A beautiful DIY product',
          image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=500',
          price: 999 + idx * 500,
          stock_qty: 50,
          in_stock: true,
          item_group: 'DIY Kits',
          has_variants: false,
          is_customizable: true,
        }));
        setProducts(mockProducts);
      } catch (error) {
        console.error('Failed to fetch wishlist products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (items.length > 0) {
      fetchProducts();
    } else {
      setIsLoading(false);
    }
  }, [items]);

  return (
    <div className="page-container">
      <div className="section-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">My Wishlist</h1>
            <p className="text-brand-text-muted mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => {
                clearWishlist();
                setProducts([]);
              }}
              className="text-sm text-brand-text-muted hover:text-error"
            >
              Clear All
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-brand-gray rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-brand-gray rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-brand-text-muted" />
            </div>
            <h2 className="text-2xl font-semibold text-brand-dark mb-2">Your wishlist is empty</h2>
            <p className="text-brand-text-muted mb-8">
              Save items you love to your wishlist and revisit them later.
            </p>
            <Link href="/products" className="btn-primary">
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.item_code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <ProductCard product={product} index={index} />
                <button
                  onClick={() => removeFromWishlist(product.item_code)}
                  className="absolute top-12 right-3 p-2 bg-white rounded-full shadow-card text-brand-text-muted hover:text-error hover:scale-110 transition-all z-10"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
