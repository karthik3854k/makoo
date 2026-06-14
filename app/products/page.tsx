'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, ChevronDown, X, Grid, List } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import type { Product, ProductFilters } from '@/types';
import { productService } from '@/services/frappe';

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
];

const categoryOptions = [
  { value: 'painting', label: 'DIY Painting Kits' },
  { value: 'wooden', label: 'Wooden Products' },
  { value: 'decor', label: 'Home Decor' },
  { value: 'gifts', label: 'Personalized Gifts' },
  { value: 'crafts', label: 'Craft Materials' },
  { value: 'resin', label: 'Resin Art' },
];

const priceRanges = [
  { value: '0-500', label: 'Under Rs. 500' },
  { value: '500-1000', label: 'Rs. 500 - Rs. 1000' },
  { value: '1000-2000', label: 'Rs. 1000 - Rs. 2000' },
  { value: '2000+', label: 'Above Rs. 2000' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || 'relevance';
  const searchQuery = searchParams.get('search') || '';

  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productService.getList({
        search: searchQuery || undefined,
        item_group: selectedCategory || undefined,
        page_length: 24,
      });
      setProducts(response.message?.items || []);
      setFilters(response.message?.filters || null);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Mock data for demo
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
        {
          name: 'DIY Candle Making Kit',
          item_code: 'CANDLE001',
          item_name: 'DIY Candle Making Kit',
          description: 'Everything you need to make beautiful scented candles',
          image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=500',
          price: 1199,
          stock_qty: 45,
          in_stock: true,
          item_group: 'DIY Kits',
          has_variants: false,
          is_customizable: false,
        },
        {
          name: 'Handcrafted Jewelry Box',
          item_code: 'JEWEL001',
          item_name: 'Handcrafted Jewelry Box',
          description: 'Wooden jewelry box with velvet lining',
          image: 'https://images.pexels.com/photos/1094766/pexels-photo-1094766.jpeg?auto=compress&cs=tinysrgb&w=500',
          price: 1599,
          stock_qty: 20,
          in_stock: true,
          item_group: 'Wooden Products',
          has_variants: false,
          is_customizable: true,
        },
      ];
      setProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) => {
    if (customizableOnly && !product.is_customizable) return false;
    if (inStockOnly && !product.in_stock) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const activeCategory = categoryOptions.find((c) => c.value === selectedCategory);

  return (
    <div className="page-container">
      <div className="section-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">
            {activeCategory ? activeCategory.label : 'All Products'}
          </h1>
          {searchQuery && (
            <p className="text-brand-text-light mt-2">
              Showing results for &quot;{searchQuery}&quot;
            </p>
          )}
          <p className="text-brand-text-muted mt-1">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-brand-gray/30 rounded-xl p-4">
                <h3 className="font-semibold text-brand-dark mb-3">Categories</h3>
                <div className="space-y-2">
                  {categoryOptions.map((category) => (
                    <a
                      key={category.value}
                      href={`/products?category=${category.value}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-brand-primary text-white'
                          : 'text-brand-text-light hover:bg-brand-gray hover:text-brand-dark'
                      }`}
                    >
                      {category.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-brand-gray/30 rounded-xl p-4">
                <h3 className="font-semibold text-brand-dark mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPriceRange.includes(range.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPriceRange([...selectedPriceRange, range.value]);
                          } else {
                            setSelectedPriceRange(selectedPriceRange.filter((r) => r !== range.value));
                          }
                        }}
                        className="w-4 h-4 rounded border-brand-gray-dark text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-sm text-brand-text-light">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="bg-brand-gray/30 rounded-xl p-4">
                <h3 className="font-semibold text-brand-dark mb-3">Filters</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customizableOnly}
                      onChange={(e) => setCustomizableOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-brand-gray-dark text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-sm text-brand-text-light">Customizable Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-brand-gray-dark text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-sm text-brand-text-light">In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-gray-dark/30">
              <div className="flex items-center gap-2">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-brand-gray-dark rounded-lg text-sm font-medium hover:border-brand-primary transition-colors"
                >
                  <Filter size={16} />
                  Filters
                </button>

                {/* View Mode */}
                <div className="hidden md:flex items-center gap-1 bg-brand-gray rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-brand-text-muted'
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'text-brand-text-muted'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-brand-text-muted hidden sm:inline">Sort by:</span>
                <div className="relative">
                  <select
                    defaultValue={selectedSort}
                    className="appearance-none bg-white border border-brand-gray-dark rounded-lg pl-3 pr-8 py-2 text-sm font-medium cursor-pointer focus:outline-none focus:border-brand-primary"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory || customizableOnly || inStockOnly) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory && activeCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm rounded-full">
                    {activeCategory.label}
                    <a href="/products" className="hover:text-brand-primary-dark">
                      <X size={14} />
                    </a>
                  </span>
                )}
                {customizableOnly && (
                  <span
                    onClick={() => setCustomizableOnly(false)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-brand-gray text-brand-text text-sm rounded-full cursor-pointer hover:bg-brand-gray-dark"
                  >
                    Customizable
                    <X size={14} />
                  </span>
                )}
                {inStockOnly && (
                  <span
                    onClick={() => setInStockOnly(false)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-brand-gray text-brand-text text-sm rounded-full cursor-pointer hover:bg-brand-gray-dark"
                  >
                    In Stock
                    <X size={14} />
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-brand-gray rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter size={32} className="text-brand-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">No products found</h3>
                <p className="text-brand-text-muted mb-6">
                  Try adjusting your filters or search query.
                </p>
                <a href="/products" className="btn-primary">
                  Clear Filters
                </a>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'
                    : 'space-y-4'
                }
              >
                {sortedProducts.map((product, index) => (
                  <ProductCard key={product.item_code} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-brand-gray-dark/30 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-brand-gray rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Categories */}
              <div>
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categoryOptions.map((category) => (
                    <a
                      key={category.value}
                      href={`/products?category=${category.value}`}
                      onClick={() => setShowFilters(false)}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-brand-primary text-white'
                          : 'bg-brand-gray text-brand-text-light hover:bg-brand-gray-dark'
                      }`}
                    >
                      {category.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-brand-gray-dark text-brand-primary" />
                      <span className="text-sm text-brand-text-light">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div>
                <h4 className="font-medium mb-3">Filters</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={customizableOnly} onChange={(e) => setCustomizableOnly(e.target.checked)} className="w-4 h-4 rounded border-brand-gray-dark text-brand-primary" />
                    <span className="text-sm text-brand-text-light">Customizable Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 rounded border-brand-gray-dark text-brand-primary" />
                    <span className="text-sm text-brand-text-light">In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-brand-gray-dark/30 p-4">
              <button onClick={() => setShowFilters(false)} className="btn-primary w-full">
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
