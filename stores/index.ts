'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, ProductCustomization, Address, User, WishlistItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (itemCode: string, customData?: ProductCustomization) => void;
  updateQuantity: (itemCode: string, quantity: number, customData?: ProductCustomization) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  appliedCoupon: string | null;
  discount: number;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
}

const getItemKey = (itemCode: string, customData?: ProductCustomization): string => {
  if (!customData) return itemCode;
  return `${itemCode}_${JSON.stringify(customData)}`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      discount: 0,

      addItem: (item) => {
        const items = get().items;
        const key = getItemKey(item.item_code, item.custom_data);
        const existingIndex = items.findIndex(
          (i) => getItemKey(i.item_code, i.custom_data) === key
        );

        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += item.quantity || 1;
          set({ items: newItems });
        } else {
          set({ items: [...items, { ...item, quantity: item.quantity || 1 }] });
        }
      },

      removeItem: (itemCode, customData) => {
        const key = getItemKey(itemCode, customData);
        set({
          items: get().items.filter(
            (i) => getItemKey(i.item_code, i.custom_data) !== key
          ),
        });
      },

      updateQuantity: (itemCode, quantity, customData) => {
        const key = getItemKey(itemCode, customData);
        set({
          items: get().items.map((i) =>
            getItemKey(i.item_code, i.custom_data) === key
              ? { ...i, quantity: Math.max(0, quantity) }
              : i
          ).filter((i) => i.quantity > 0),
        });
      },

      clearCart: () => set({ items: [], appliedCoupon: null, discount: 0 }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().discount;
        return subtotal - discount;
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      applyCoupon: (code, discount) => set({ appliedCoupon: code, discount }),

      removeCoupon: () => set({ appliedCoupon: null, discount: 0 }),
    }),
    {
      name: 'makoo-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'makoo-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (itemCode: string) => void;
  removeFromWishlist: (itemCode: string) => void;
  isInWishlist: (itemCode: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (itemCode) => {
        const items = get().items;
        if (!items.find((i) => i.item_code === itemCode)) {
          set({ items: [...items, { item_code: itemCode, added_at: new Date() }] });
        }
      },

      removeFromWishlist: (itemCode) => {
        set({ items: get().items.filter((i) => i.item_code !== itemCode) });
      },

      isInWishlist: (itemCode) => {
        return get().items.some((i) => i.item_code === itemCode);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'makoo-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface CheckoutState {
  shippingAddress: Address | null;
  billingAddress: Address | null;
  setShippingAddress: (address: Address | null) => void;
  setBillingAddress: (address: Address | null) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  shippingAddress: null,
  billingAddress: null,

  setShippingAddress: (address) => set({ shippingAddress: address }),
  setBillingAddress: (address) => set({ billingAddress: address }),

  reset: () => set({ shippingAddress: null, billingAddress: null }),
}));

interface UIState {
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  isSearchOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  isSearchOpen: false,

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
