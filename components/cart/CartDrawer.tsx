'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore, useUIStore } from '@/stores';

export default function CartDrawer() {
  const { isCartDrawerOpen, setCartDrawerOpen } = useUIStore();
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();

  const subtotal = getSubtotal();

  const handleClose = () => setCartDrawerOpen(false);

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
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

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-gray-dark/30">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-brand-primary" />
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-xs font-medium rounded-full">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-brand-text-muted hover:text-brand-text hover:bg-brand-gray rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-brand-gray rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag size={32} className="text-brand-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Your cart is empty</h3>
                <p className="text-sm text-brand-text-muted mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <button
                  onClick={handleClose}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.item_code}-${JSON.stringify(item.custom_data || '')}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 p-3 bg-brand-gray/50 rounded-xl"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-brand-gray shrink-0">
                          <Image
                            src={item.image || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=200'}
                            alt={item.item_name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.item_code}`}
                            onClick={handleClose}
                            className="text-sm font-medium text-brand-dark hover:text-brand-primary line-clamp-2"
                          >
                            {item.item_name}
                          </Link>

                          {item.custom_data && (
                            <p className="text-xs text-brand-text-muted mt-1">
                              {item.custom_data.custom_text && `Text: "${item.custom_data.custom_text}"`}
                              {item.custom_data.custom_color && ` • ${item.custom_data.custom_color}`}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-semibold text-brand-primary">
                              Rs. {item.price.toLocaleString()}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.item_code, item.quantity - 1, item.custom_data)}
                                className="w-7 h-7 rounded-full bg-white border border-brand-gray-dark flex items-center justify-center hover:border-brand-primary transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.item_code, item.quantity + 1, item.custom_data)}
                                disabled={item.quantity >= item.stock_qty}
                                className="w-7 h-7 rounded-full bg-white border border-brand-gray-dark flex items-center justify-center hover:border-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.item_code, item.custom_data)}
                          className="p-2 text-brand-text-muted hover:text-error transition-colors self-start"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-brand-gray-dark/30 p-4 space-y-4">
                  {/* Subtotal */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brand-text-muted">Subtotal</span>
                      <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brand-text-muted">Shipping</span>
                      <span className="text-xs text-brand-text-muted">Calculated at checkout</span>
                    </div>
                    <div className="h-px bg-brand-gray-dark" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-lg font-bold text-brand-primary">
                        Rs. {subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link
                      href="/checkout"
                      onClick={handleClose}
                      className="btn-primary w-full justify-center"
                    >
                      Checkout
                    </Link>
                    <Link
                      href="/cart"
                      onClick={handleClose}
                      className="btn-outline w-full justify-center"
                    >
                      View Cart
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
