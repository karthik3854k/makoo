'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Palette, Gift, Sparkles, Truck, Shield, Leaf } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { productService } from '@/services/frappe';

const categories = [
  {
    name: 'DIY Painting Kits',
    slug: 'painting',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600',
    count: '50+ products',
  },
  {
    name: 'Wooden Products',
    slug: 'wooden',
    image: 'https://images.pexels.com/photos/1094766/pexels-photo-1094766.jpeg?auto=compress&cs=tinysrgb&w=600',
    count: '30+ products',
  },
  {
    name: 'Home Decor',
    slug: 'decor',
    image: 'https://images.pexels.com/photos/6032662/pexels-photo-6032662.jpeg?auto=compress&cs=tinysrgb&w=600',
    count: '40+ products',
  },
  {
    name: 'Personalized Gifts',
    slug: 'gifts',
    image: 'https://images.pexels.com/photos/264870/pexels-photo-264870.jpeg?auto=compress&cs=tinysrgb&w=600',
    count: '60+ products',
  },
];

const features = [
  {
    icon: Palette,
    title: '100% Customizable',
    description: 'Personalize every product to your style',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over Rs. 999',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Premium materials only',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Sustainable packaging',
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getList({ page_length: 8 });
        setFeaturedProducts(response.message?.items || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Use mock data for demo
        const mockProducts: Product[] = [
          {
            name: 'DIY Painting Kit - Landscape',
            item_code: 'PAINT001',
            item_name: 'DIY Painting Kit - Landscape',
            description: 'Create beautiful landscape paintings with our beginner-friendly kit',
            image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=500',
            price: 1499,
            stock_qty: 50,
            in_stock: true,
            item_group: 'DIY Kits',
            has_variants: false,
            is_customizable: true,
          },
          {
            name: 'Personalized Wooden Name Board',
            item_code: 'WOOD001',
            item_name: 'Personalized Wooden Name Board',
            description: 'Custom engraved wooden name board for your home',
            image: 'https://images.pexels.com/photos/1094766/pexels-photo-1094766.jpeg?auto=compress&cs=tinysrgb&w=500',
            price: 899,
            stock_qty: 100,
            in_stock: true,
            item_group: 'Wooden Products',
            has_variants: false,
            is_customizable: true,
          },
          {
            name: 'Resin Art Coasters Set',
            item_code: 'RESIN001',
            item_name: 'Resin Art Coasters Set',
            description: 'Handmade resin art coasters with unique patterns',
            image: 'https://images.pexels.com/photos/6032662/pexels-photo-6032662.jpeg?auto=compress&cs=tinysrgb&w=500',
            price: 1299,
            stock_qty: 30,
            in_stock: true,
            item_group: 'Resin Art',
            has_variants: false,
            is_customizable: true,
          },
          {
            name: 'Custom Photo Frame',
            item_code: 'FRAME001',
            item_name: 'Custom Photo Frame',
            description: 'Personalized photo frame with custom engraving',
            image: 'https://images.pexels.com/photos/264870/pexels-photo-264870.jpeg?auto=compress&cs=tinysrgb&w=500',
            price: 799,
            stock_qty: 75,
            in_stock: true,
            item_group: 'Home Decor',
            has_variants: false,
            is_customizable: true,
          },
        ];
        setFeaturedProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-white to-brand-gray/30 overflow-hidden">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
                <Sparkles size={16} className="text-brand-primary" />
                <span className="text-sm font-medium text-brand-primary">Create Something Beautiful</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight mb-6">
                Unleash Your{' '}
                <span className="text-gradient">Creativity</span>
                {' '}With DIY Magic
              </h1>

              <p className="text-lg text-brand-text-light mb-8 max-w-xl mx-auto lg:mx-0">
                Discover unique DIY kits, personalized gifts, and handcrafted products. Express yourself through creativity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products" className="btn-primary">
                  Shop Now
                  <ArrowRight size={18} />
                </Link>
                <Link href="/customization" className="btn-secondary">
                  <Gift size={18} />
                  Personalize a Gift
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 flex gap-8 justify-center lg:justify-start">
                <div>
                  <p className="text-3xl font-bold text-brand-dark">10K+</p>
                  <p className="text-sm text-brand-text-muted">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-dark">500+</p>
                  <p className="text-sm text-brand-text-muted">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-dark">4.9</p>
                  <p className="text-sm text-brand-text-muted">Rating</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-primary-light/20 rounded-full blur-3xl" />
                <Image
                  src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="DIY Crafts"
                  fill
                  className="object-cover rounded-3xl shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-brand-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl" />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-brand-gray/30">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-card flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={24} className="text-brand-primary" />
                </div>
                <h3 className="font-semibold text-brand-dark mb-1">{feature.title}</h3>
                <p className="text-sm text-brand-text-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">Shop by Category</h2>
              <p className="text-brand-text-muted">Find the perfect DIY kit for you</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-brand-primary font-medium hover:gap-3 transition-all">
              View All
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group relative block overflow-hidden rounded-2xl aspect-[3/4]"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-white font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-white/70 text-sm">{category.count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 md:hidden text-center">
            <Link href="/products" className="btn-outline">
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-brand-gray/20">
        <div className="section-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">Featured Products</h2>
              <p className="text-brand-text-muted">Handpicked favorites from our collection</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-brand-primary font-medium hover:gap-3 transition-all">
              View All
              <ArrowRight size={18} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-brand-gray rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.item_code} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-brand-dark rounded-3xl overflow-hidden p-8 md:p-12 lg:p-16"
          >
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Create Memories with{' '}
                <span className="text-brand-primary">Personalized Gifts</span>
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Transform ordinary moments into extraordinary memories. Customize gifts that speak from the heart.
              </p>
              <Link href="/customization" className="btn-primary bg-brand-primary hover:bg-brand-primary-light">
                Start Customizing
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
              <Image
                src="https://images.pexels.com/photos/6032662/pexels-photo-6032662.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="DIY Crafts"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
