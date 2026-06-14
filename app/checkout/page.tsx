'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, MapPin, CreditCard, ShoppingBag, Loader2 } from 'lucide-react';
import { useCartStore, useCheckoutStore, useAuthStore } from '@/stores';
import { orderService, paymentService, addressService } from '@/services/frappe';
import type { Address } from '@/types';
import { toast } from 'sonner';

const steps = [
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'confirm', label: 'Confirm', icon: Check },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { shippingAddress, setShippingAddress } = useCheckoutStore();
  const { user, isAuthenticated } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = getSubtotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address_title: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    phone: '',
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto text-brand-text-muted mb-4" />
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Your cart is empty</h1>
          <p className="text-brand-text-muted mb-6">Add items to your cart to checkout.</p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddAddress = async () => {
    setIsLoading(true);
    try {
      const newAddress = await addressService.create({
        ...addressForm,
        address_type: 'Shipping',
      });
      setAddresses([...addresses, newAddress.data]);
      setShippingAddress(newAddress.data);
      setShowAddressForm(false);
      toast.success('Address saved');
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    setIsLoading(true);
    try {
      // Create Sales Order
      const orderData = {
        customer: user?.customer_id || user?.email || '',
        items: items.map((item) => ({
          item_code: item.item_code,
          qty: item.quantity,
          rate: item.price,
          custom_data: item.custom_data ? JSON.stringify(item.custom_data) : undefined,
        })),
        shipping_address_name: shippingAddress.name,
        billing_address_name: shippingAddress.name,
      };

      const orderResponse = await orderService.create(orderData);
      const salesOrder = orderResponse.data;

      if (paymentMethod === 'cod') {
        // Cash on Delivery
        setOrderId(salesOrder.name);
        setOrderComplete(true);
        clearCart();
        setCurrentStep(2);
      } else {
        // Razorpay Payment
        const paymentReq = await paymentService.createPaymentRequest(salesOrder.name);

        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_xxxxx',
          amount: total * 100,
          currency: 'INR',
          order_id: paymentReq.data.razorpay_order_id,
          name: 'Makoo',
          description: `Order #${salesOrder.name}`,
          prefill: {
            name: user?.full_name || '',
            email: user?.email || '',
            contact: shippingAddress.phone || '',
          },
          handler: async (response: any) => {
            try {
              await paymentService.createPaymentEntry({
                payment_request: paymentReq.data.name,
                paid_amount: total,
                mode_of_payment: 'Razorpay',
                reference_no: response.razorpay_payment_id,
              });

              setOrderId(salesOrder.name);
              setOrderComplete(true);
              clearCart();
              setCurrentStep(2);
              toast.success('Payment successful!');
            } catch (error) {
              toast.error('Payment verification failed');
            }
          },
          modal: {
            ondismiss: () => {
              setIsLoading(false);
            },
          },
        };

        // Open Razorpay
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Order failed:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-brand-dark">Select Shipping Address</h2>

            {/* Saved Addresses */}
            {addresses.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <button
                    key={addr.name}
                    onClick={() => setShippingAddress(addr)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      shippingAddress?.name === addr.name
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-brand-gray-dark hover:border-brand-primary/50'
                    }`}
                  >
                    <p className="font-medium text-brand-dark">{addr.address_title}</p>
                    <p className="text-sm text-brand-text-light mt-1">
                      {addr.address_line1}, {addr.address_line2 && `${addr.address_line2}, `}
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-sm text-brand-text-muted mt-1">{addr.phone}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Add New Address */}
            {!showAddressForm ? (
              <button
                onClick={() => setShowAddressForm(true)}
                className="w-full py-4 border-2 border-dashed border-brand-gray-dark rounded-xl text-brand-text-muted hover:border-brand-primary hover:text-brand-primary transition-colors"
              >
                + Add New Address
              </button>
            ) : (
              <div className="bg-white rounded-xl border border-brand-gray-dark/30 p-6 space-y-4">
                <h3 className="font-medium text-brand-dark">New Address</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={addressForm.address_title}
                    onChange={(e) => setAddressForm({ ...addressForm, address_title: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="input-field"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Address Line 1 *"
                  value={addressForm.address_line1}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                  className="input-field"
                />

                <input
                  type="text"
                  placeholder="Address Line 2"
                  value={addressForm.address_line2}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                  className="input-field"
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City *"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="PIN Code *"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={handleAddAddress} className="btn-primary">
                    Save Address
                  </button>
                  <button onClick={() => setShowAddressForm(false)} className="btn-outline">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {shippingAddress && (
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-primary w-full justify-center"
              >
                Continue to Payment
              </button>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-brand-dark">Payment Method</h2>

            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('razorpay')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-brand-gray-dark hover:border-brand-primary/50'
                }`}
              >
                <CreditCard size={24} className="text-brand-primary" />
                <div className="text-left">
                  <p className="font-medium text-brand-dark">Online Payment</p>
                  <p className="text-sm text-brand-text-muted">Pay securely with Razorpay</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('cod')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-brand-gray-dark hover:border-brand-primary/50'
                }`}
              >
                <ShoppingBag size={24} className="text-brand-primary" />
                <div className="text-left">
                  <p className="font-medium text-brand-dark">Cash on Delivery</p>
                  <p className="text-sm text-brand-text-muted">Pay when you receive your order</p>
                </div>
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-brand-gray/30 rounded-xl p-4 space-y-2">
              <h3 className="font-medium text-brand-dark mb-3">Order Summary</h3>
              {items.map((item) => (
                <div key={item.item_code} className="flex justify-between text-sm">
                  <span className="text-brand-text-light">
                    {item.item_name} x {item.quantity}
                  </span>
                  <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="h-px bg-brand-gray-dark my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-brand-dark pt-2">
                <span>Total</span>
                <span className="text-brand-primary">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCurrentStep(0)} className="btn-outline flex-1">
                <ChevronLeft size={18} />
                Back
              </button>
              <button onClick={handlePlaceOrder} disabled={isLoading} className="btn-primary flex-[2] justify-center">
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <Check size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} className="text-success" />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Order Placed Successfully!</h2>
            <p className="text-brand-text-muted mb-6">
              Thank you for your order. We&apos;ll send you an email with your order details.
            </p>
            <p className="text-sm text-brand-text-light mb-8">
              Order ID: <span className="font-mono font-medium text-brand-dark">{orderId || 'MAK-DEMO-001'}</span>
            </p>

            <div className="flex gap-4 justify-center">
              <Link href="/account" className="btn-outline">
                View Orders
              </Link>
              <Link href="/products" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div className="section-container max-w-3xl">
        {/* Progress Steps */}
        {!orderComplete && (
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-all ${
                    currentStep >= idx
                      ? 'bg-brand-primary text-white'
                      : 'bg-brand-gray-dark text-brand-text-muted'
                  }`}
                >
                  {currentStep > idx ? <Check size={18} /> : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > idx ? 'bg-brand-primary' : 'bg-brand-gray-dark'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        {renderStep()}
      </div>
    </div>
  );
}
