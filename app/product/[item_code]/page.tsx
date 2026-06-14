'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
  Check,
  ChevronLeft,
} from 'lucide-react';
import type { Product, ProductCustomization } from '@/types';
import { productService } from '@/services/frappe';
import { useCartStore, useWishlistStore } from '@/stores';
import ProductCard from '@/components/product/ProductCard';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const CustomizationPanel = dynamic(() => import('@/components/customization/CustomizationPanel'), {
  loading: () => <div className="h-96 bg-brand-gray rounded-xl animate-pulse" />,
  ssr: false,
});

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ item_code: string }>;
}) {
  const resolvedParams = use(params);
  const itemCode = resolvedParams.item_code;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<ProductCustomization | null>(null);

  const addToCart = useCartStore((state) => state.addItem);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product.item_code) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getInfo(itemCode);
        setProduct(response.message);

        // Fetch related products
        try {
          const relatedRes = await productService.getRelated(itemCode);
          setRelatedProducts(relatedRes.message?.items || []);
        } catch {
          // Use mock related products
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        // Mock product data for demo
        const mockProduct: Product = {
          name: 'DIY Painting Kit - Landscape',
          item_code: itemCode,
          item_name: 'DIY Painting Kit - Landscape Edition',
          description: 'Create beautiful landscape paintings with our comprehensive DIY painting kit.',
          web_long_description: `<h3>Create Your Masterpiece</h3>
<p>This premium DIY painting kit is perfect for beginners and experienced artists alike. Everything you need to create stunning landscape paintings is included.</p>
<h4>What's Inside:</h4>
<ul>
  <li>3 Pre-drawn canvases (12"x16")</li>
  <li>24 Professional acrylic colors</li>
  <li>Set of 12 brushes</li>
  <li>Palette and mixing tray</li>
  <li>Easel stand</li>
  <li>Step-by-step instruction guide</li>
</ul>
<h4>Features:</h4>
<ul>
  <li>Non-toxic, eco-friendly paints</li>
  <li>Quick-drying formula</li>
  <li>Vibrant, fade-resistant colors</li>
</ul>`,
          image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800',
          website_image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800',
          price: 1499,
          stock_qty: 50,
          in_stock: true,
          item_group: 'DIY Kits',
          has_variants: false,
          is_customizable: true,
          customization_options: [
            { field_name: 'custom_text', label: 'Custom Name/Text', field_type: 'text', required: false, max_length: 30 },
            { field_name: 'custom_color', label: 'Frame Color', field_type: 'select', required: false, options: ['Natural', 'White', 'Black', 'Walnut'] },
          ],
          website_specifications: [
            { label: 'Canvas Size', value: '12" x 16"' },
            { label: 'Paint Type', value: 'Acrylic' },
            { label: 'Colors', value: '24 shades' },
            { label: 'Weight', value: '1.5 kg' },
          ],
          ratings: { average_rating: 4.8, total_reviews: 127 },
        };
        setProduct(mockProduct);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [itemCode]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      item_code: product.item_code,
      item_name: product.item_name,
      image: product.image || product.website_image || '',
      price: product.price,
      quantity,
      stock_qty: product.stock_qty,
      custom_data: customization || undefined,
    });

    toast.success('Added to cart', {
      description: `${product.item_name} has been added to your cart.`,
    });
  };

  const handleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      removeFromWishlist(product.item_code);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product.item_code);
      toast.success('Added to wishlist');
    }
  };

  const images = product
    ? [
        product.image || product.website_image || '',
        product.thumbnail || product.image || '',
      ]
    : [];

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="aspect-square bg-brand-gray rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 bg-brand-gray rounded w-1/4 animate-pulse" />
              <div className="h-8 bg-brand-gray rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-brand-gray rounded w-1/2 animate-pulse" />
              <div className="h-20 bg-brand-gray rounded animate-pulse" />
              <div className="h-12 bg-brand-gray rounded w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Product Not Found</h1>
          <p className="text-brand-text-muted mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-brand-text-muted hover:text-brand-primary">
            Home
          </Link>
          <ChevronRight size={14} className="text-brand-text-muted" />
          <Link href="/products" className="text-brand-text-muted hover:text-brand-primary">
            Products
          </Link>
          {product.item_group && (
            <>
              <ChevronRight size={14} className="text-brand-text-muted" />
              <Link
                href={`/products?category=${product.item_group.toLowerCase()}`}
                className="text-brand-text-muted hover:text-brand-primary"
              >
                {product.item_group}
              </Link>
            </>
          )}
          <ChevronRight size={14} className="text-brand-text-muted" />
          <span className="text-brand-dark font-medium truncate max-w-[200px]">
            {product.item_name}
          </span>
        </nav>

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-brand-gray rounded-2xl overflow-hidden">
              <Image
                src={images[selectedImage] || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={product.item_name}
                fill
                className="object-cover"
                priority
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {!product.in_stock && <span className="badge-error">Out of Stock</span>}
                {product.is_customizable && <span className="badge-primary">Customizable</span>}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-primary hover:text-white transition-colors"
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all ${
                      selectedImage === idx ? 'ring-2 ring-brand-primary' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category */}
            <p className="text-sm text-brand-text-muted uppercase tracking-wider">
              {product.item_group}
            </p>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">{product.item_name}</h1>

            {/* Rating */}
            {product.ratings && product.ratings.total_reviews > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < Math.floor(product.ratings!.average_rating)
                          ? 'text-warning fill-warning'
                          : 'text-brand-gray-dark'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-brand-text-light">
                  {product.ratings.average_rating} ({product.ratings.total_reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-primary">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>

            {/* Description */}
            <p className="text-brand-text-light leading-relaxed">{product.description}</p>

            {/* Customization Options */}
            {product.is_customizable && product.customization_options && (
              <CustomizationPanel
                options={product.customization_options}
                onCustomizationChange={setCustomization}
              />
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-brand-dark">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-brand-gray-dark rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-brand-gray transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_qty, quantity + 1))}
                    disabled={quantity >= product.stock_qty}
                    className="w-10 h-10 flex items-center justify-center hover:bg-brand-gray transition-colors disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-brand-text-muted">
                  {product.stock_qty} available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-1 btn-primary justify-center"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button className="btn-outline">
                <Share2 size={18} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-brand-gray-dark/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-gray rounded-lg flex items-center justify-center">
                  <Truck size={18} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-brand-text-muted">Orders over Rs. 999</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-gray rounded-lg flex items-center justify-center">
                  <Shield size={18} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Quality Guaranteed</p>
                  <p className="text-xs text-brand-text-muted">Premium materials</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-gray rounded-lg flex items-center justify-center">
                  <RotateCcw size={18} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-brand-text-muted">7 day policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-gray rounded-lg flex items-center justify-center">
                  <Check size={18} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Handcrafted</p>
                  <p className="text-xs text-brand-text-muted">Made with love</p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            {product.website_specifications && product.website_specifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-brand-dark">Specifications</h3>
                <div className="space-y-2">
                  {product.website_specifications.map((spec) => (
                    <div key={spec.label} className="flex justify-between text-sm">
                      <span className="text-brand-text-muted">{spec.label}</span>
                      <span className="text-brand-dark font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Description Section */}
        {product.web_long_description && (
          <div className="mt-16 space-y-8">
            <h2 className="text-2xl font-bold text-brand-dark">Product Details</h2>
            <div
              className="prose prose-brand max-w-none"
              dangerouslySetInnerHTML={{ __html: product.web_long_description }}
            />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-brand-dark">You May Also Like</h2>
              <Link href="/products" className="text-brand-primary font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.slice(0, 4).map((p, idx) => (
                <ProductCard key={p.item_code} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
