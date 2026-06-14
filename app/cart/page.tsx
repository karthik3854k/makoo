'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/stores';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    clearCart,
    appliedCoupon,
    discount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const subtotal = getSubtotal();
  const total = getTotal();
  const shipping = subtotal >= 999 ? 0 : 99;

  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'makoo10') {
      applyCoupon('MAKOO10', subtotal * 0.1);
      toast.success('Coupon applied! 10% off');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  return (
    <div className="page-container">
      <div className="section-container">
        <h1 className="text-3xl font-bold text-brand-dark mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-brand-gray rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-brand-text-muted" />
            </div>
            <h2 className="text-2xl font-semibold text-brand-dark mb-2">Your cart is empty</h2>
            <p className="text-brand-text-muted mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/products" className="btn-primary">
              Start Shopping
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-brand-gray-dark/30 overflow-hidden">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.item_code}-${JSON.stringify(item.custom_data || '')}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-4 p-4 ${
                      index !== items.length - 1 ? 'border-b border-brand-gray-dark/30' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className="relative w-24 h-28 rounded-lg overflow-hidden bg-brand-gray shrink-0">
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
                        className="text-base font-medium text-brand-dark hover:text-brand-primary line-clamp-2"
                      >
                        {item.item_name}
                      </Link>

                      {item.custom_data && (
                        <p className="text-sm text-brand-text-muted mt-1">
                          {item.custom_data.custom_text && `Text: "${item.custom_data.custom_text}"`}
                          {item.custom_data.custom_color && ` • Color: ${item.custom_data.custom_color}`}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-medium text-brand-primary">
                          Rs. {item.price.toLocaleString()}
                        </span>

                        {/* Quantity */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.item_code, item.quantity - 1, item.custom_data)}
                            className="w-8 h-8 rounded-lg border border-brand-gray-dark flex items-center justify-center hover:border-brand-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.item_code, item.quantity + 1, item.custom_data)}
                            disabled={item.quantity >= item.stock_qty}
                            className="w-8 h-8 rounded-lg border border-brand-gray-dark flex items-center justify-center hover:border-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-semibold text-brand-dark">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </p>
                          <button
                            onClick={() => {
                              removeItem(item.item_code, item.custom_data);
                              toast.success('Item removed from cart');
                            }}
                            className="text-sm text-error hover:underline mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => {
                  clearCart();
                  toast.success('Cart cleared');
                }}
                className="text-sm text-brand-text-muted hover:text-error"
              >
                Clear all items
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-brand-gray-dark/30 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-brand-dark mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-text-light">Subtotal</span>
                    <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-success">
                      <span>Discount</span>
                      <span>-Rs. {discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-brand-text-light">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-success font-medium">Free</span>
                    ) : (
                      <span className="font-medium">Rs. {shipping}</span>
                    )}
                  </div>

                  {subtotal > 0 && subtotal < 999 && (
                    <p className="text-xs text-brand-text-muted bg-brand-gray p-3 rounded-lg">
                      Add Rs. {(999 - subtotal).toLocaleString()} more for free shipping!
                    </p>
                  )}

                  <div className="h-px bg-brand-gray-dark" />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-brand-dark">Total</span>
                    <span className="text-xl font-bold text-brand-primary">
                      Rs. {(total + shipping).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-success/10 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-success" />
                        <span className="text-sm font-medium text-success">{appliedCoupon}</span>
                      </div>
                      <button onClick={removeCoupon} className="text-sm text-error hover:underline">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="input-field flex-1"
                      />
                      <button onClick={handleApplyCoupon} className="btn-outline">
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => router.push('/checkout')}
                  className="btn-primary w-full justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/products"
                  className="block text-center text-sm text-brand-primary hover:underline mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
