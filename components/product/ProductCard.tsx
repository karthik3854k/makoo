'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types';
import { useCartStore, useWishlistStore } from '@/stores';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.item_code);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      item_code: product.item_code,
      item_name: product.item_name,
      image: product.image || product.website_image || '',
      price: product.price,
      quantity: 1,
      stock_qty: product.stock_qty,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.item_code);
    } else {
      addToWishlist(product.item_code);
    }
  };

  const imageUrl = imageError
    ? 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=500'
    : product.image || product.website_image || product.thumbnail ||
      'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/product/${product.item_code}`}>
        <div
          className="relative bg-white rounded-2xl overflow-hidden border border-brand-gray-dark/30 transition-all duration-300 hover:shadow-lg hover:border-brand-gray-dark"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-brand-gray">
            <Image
              src={imageUrl}
              alt={product.item_name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />

            {/* Overlay on Hover */}
            <div
              className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {!product.in_stock && (
                <span className="badge-error">Out of Stock</span>
              )}
              {product.is_customizable && (
                <span className="badge-primary">Customizable</span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isWishlisted
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/90 text-brand-text-light hover:bg-brand-primary hover:text-white'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>

            {/* Quick Add Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              initial={{ opacity: 0, y: 10 }}
              animate={isHovered && product.in_stock ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 left-3 right-3 bg-brand-dark text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-brand-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </motion.button>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <p className="text-xs text-brand-text-muted mb-1 uppercase tracking-wider">
              {product.item_group}
            </p>
            <h3 className="text-sm font-medium text-brand-dark line-clamp-2 mb-2 min-h-[2.5rem]">
              {product.item_name}
            </h3>

            {/* Rating */}
            {product.ratings && product.ratings.total_reviews > 0 && (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={`${
                        i < Math.floor(product.ratings!.average_rating)
                          ? 'text-warning fill-warning'
                          : 'text-brand-gray-dark'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-brand-text-muted">
                  ({product.ratings.total_reviews})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-brand-primary">
                {product.formatted_price || `Rs. ${product.price.toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
