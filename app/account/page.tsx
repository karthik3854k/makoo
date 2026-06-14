'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Heart, MapPin, Settings, LogOut, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { useAuthStore, useWishlistStore } from '@/stores';
import { authService, addressService, orderService } from '@/services/frappe';
import type { Address, SalesOrder } from '@/types';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const OrderCard = dynamic(() => import('@/components/account/OrderCard'), {
  loading: () => <div className="h-32 bg-brand-gray rounded-xl animate-pulse" />,
  ssr: false,
});

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [addrRes, orderRes] = await Promise.all([
          addressService.list(),
          user?.customer_id ? orderService.list(user.customer_id) : Promise.resolve({ data: [] }),
        ]);
        setAddresses(addrRes.data || []);
        setOrders(orderRes.data || []);
      } catch (error) {
        console.error('Failed to fetch account data:', error);
        // Use mock data
        setAddresses([]);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router, user?.customer_id]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore logout errors
    }
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email,
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleDeleteAddress = async (name: string) => {
    try {
      await addressService.delete(name);
      setAddresses(addresses.filter((a) => a.name !== name));
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="page-container">
      <div className="section-container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-brand-gray-dark/30 p-6">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-gray-dark/30">
                <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <User size={24} className="text-brand-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-brand-dark">{user?.full_name || 'User'}</h2>
                  <p className="text-sm text-brand-text-muted">{user?.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'text-brand-text-light hover:bg-brand-gray hover:text-brand-dark'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error/10 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-brand-gray-dark/30 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-brand-dark">Profile Information</h3>
                    <button
                      onClick={() => setEditingProfile(!editingProfile)}
                      className="btn-ghost gap-2"
                    >
                      <Edit2 size={16} />
                      {editingProfile ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-dark">First Name</label>
                      <input
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                        disabled={!editingProfile}
                        className="input-field disabled:opacity-70 disabled:bg-brand-gray"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-dark">Last Name</label>
                      <input
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                        disabled={!editingProfile}
                        className="input-field disabled:opacity-70 disabled:bg-brand-gray"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-dark">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="input-field disabled:opacity-70 disabled:bg-brand-gray"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-dark">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!editingProfile}
                        className="input-field disabled:opacity-70 disabled:bg-brand-gray"
                      />
                    </div>
                  </div>

                  {editingProfile && (
                    <button className="btn-primary mt-6">Save Changes</button>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-brand-dark">Order History</h3>

                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-brand-gray rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-brand-gray-dark/30 p-12 text-center">
                      <ShoppingBag size={48} className="mx-auto text-brand-text-muted mb-4" />
                      <h4 className="text-lg font-semibold text-brand-dark mb-2">No orders yet</h4>
                      <p className="text-brand-text-muted mb-6">Start shopping to see your orders here.</p>
                      <Link href="/products" className="btn-primary">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <OrderCard key={order.name} order={order} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-brand-dark">Saved Addresses</h3>
                    <Link href="/account/address/new" className="btn-primary">
                      Add New Address
                    </Link>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-brand-gray-dark/30 p-12 text-center">
                      <MapPin size={48} className="mx-auto text-brand-text-muted mb-4" />
                      <h4 className="text-lg font-semibold text-brand-dark mb-2">No addresses saved</h4>
                      <p className="text-brand-text-muted mb-6">Add an address for faster checkout.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div key={address.name} className="bg-white rounded-xl border border-brand-gray-dark/30 p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className={`badge ${address.is_primary_address ? 'badge-primary' : 'badge'}`}>
                                {address.address_type}
                              </span>
                              {address.is_primary_address && (
                                <span className="badge-success ml-2">Primary</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/account/address/${address.name}`} className="p-2 text-brand-text-muted hover:text-brand-primary">
                                <Edit2 size={16} />
                              </Link>
                              <button
                                onClick={() => handleDeleteAddress(address.name)}
                                className="p-2 text-brand-text-muted hover:text-error"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <p className="font-medium text-brand-dark">{address.address_title}</p>
                          <p className="text-sm text-brand-text-light mt-2">
                            {address.address_line1}
                            {address.address_line2 && `, ${address.address_line2}`}
                            <br />
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          {address.phone && (
                            <p className="text-sm text-brand-text-muted mt-2">{address.phone}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-brand-dark">My Wishlist</h3>
                  <WishlistPanel />
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-2xl border border-brand-gray-dark/30 p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-brand-dark mb-6">Account Settings</h3>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-brand-gray-dark/30">
                      <div>
                        <p className="font-medium text-brand-dark">Change Password</p>
                        <p className="text-sm text-brand-text-muted">Update your password</p>
                      </div>
                      <ChevronRight size={20} className="text-brand-text-muted" />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-brand-gray-dark/30">
                      <div>
                        <p className="font-medium text-brand-dark">Email Notifications</p>
                        <p className="text-sm text-brand-text-muted">Manage email preferences</p>
                      </div>
                      <ChevronRight size={20} className="text-brand-text-muted" />
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-medium text-error">Delete Account</p>
                        <p className="text-sm text-brand-text-muted">Permanently delete your account</p>
                      </div>
                      <button className="text-sm text-error hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

function WishlistPanel() {
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const { items, removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    // In real app, fetch products from API
    // For demo, show placeholder
    setWishlistProducts([]);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-brand-gray-dark/30 p-12 text-center">
        <Heart size={48} className="mx-auto text-brand-text-muted mb-4" />
        <h4 className="text-lg font-semibold text-brand-dark mb-2">Your wishlist is empty</h4>
        <p className="text-brand-text-muted mb-6">Save items you love for later.</p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* Wishlist items would be rendered here */}
      <p className="col-span-full text-center text-brand-text-muted">
        {items.length} item(s) in your wishlist
      </p>
    </div>
  );
}
