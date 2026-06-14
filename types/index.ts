// Product Types
export interface Product {
  name: string;
  item_code: string;
  item_name: string;
  description: string;
  web_long_description?: string;
  image: string;
  website_image?: string;
  thumbnail?: string;
  price: number;
  formatted_price?: string;
  currency?: string;
  stock_qty: number;
  in_stock: boolean;
  item_group: string;
  item_groups?: string[];
  brand?: string;
  weight?: number;
  has_variants: boolean;
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  website_specifications?: Specification[];
  ratings?: ProductRating;
  is_customizable?: boolean;
  customization_options?: CustomizationOption[];
  related_items?: RelatedProduct[];
}

export interface ProductVariant {
  name: string;
  item_code: string;
  price: number;
  stock_qty: number;
  attributes: VariantAttribute[];
}

export interface VariantAttribute {
  attribute: string;
  attribute_value: string;
}

export interface ProductAttribute {
  attribute: string;
  value: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface ProductRating {
  average_rating: number;
  total_reviews: number;
  rating_distribution?: Record<number, number>;
}

export interface RelatedProduct {
  item_code: string;
  item_name: string;
  image: string;
  price: number;
}

export interface ProductListResponse {
  message: {
    items: Product[];
    filters?: ProductFilters;
    settings?: WebshopSettings;
  };
}

export interface ProductFilters {
  item_groups: FilterOption[];
  brands: FilterOption[];
  attributes: AttributeFilter[];
}

export interface FilterOption {
  name: string;
  value: string;
  item_count: number;
}

export interface AttributeFilter {
  name: string;
  values: FilterOption[];
}

export interface WebshopSettings {
  company_name: string;
  currency: string;
  currency_symbol: string;
  default_customer_group: string;
  default_territory: string;
}

// Customization Types
export interface CustomizationOption {
  field_name: string;
  label: string;
  field_type: 'text' | 'image' | 'color' | 'select';
  required: boolean;
  max_length?: number;
  options?: string[];
  max_file_size?: number;
  allowed_file_types?: string[];
  preview_position?: { x: number; y: number };
}

export interface ProductCustomization {
  item_code?: string;
  custom_text?: string;
  custom_image?: string;
  custom_color?: string;
  font_style?: string;
  additional_notes?: string;
}

// Cart Types
export interface CartItem {
  item_code: string;
  item_name: string;
  image: string;
  price: number;
  quantity: number;
  stock_qty: number;
  custom_data?: ProductCustomization;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discount: number;
  applied_coupon?: string;
}

// Address Types
export interface Address {
  name: string;
  address_title: string;
  address_type: 'Billing' | 'Shipping';
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  pincode: string;
  phone?: string;
  email_id?: string;
  is_primary_address?: boolean;
  is_shipping_address?: boolean;
}

// Order Types
export interface SalesOrderItem {
  item_code: string;
  item_name: string;
  qty: number;
  rate: number;
  amount: number;
  custom_data?: ProductCustomization;
}

export interface SalesOrder {
  name: string;
  customer: string;
  transaction_date?: string;
  delivery_date?: string;
  items: SalesOrderItem[];
  total_qty: number;
  total_net_weight?: number;
  base_total: number;
  base_grand_total: number;
  rounded_total: number;
  status: OrderStatus;
  customer_name: string;
  shipping_address_name?: string;
  billing_address_name?: string;
  payment_request?: PaymentRequest;
}

export type OrderStatus =
  | 'Draft'
  | 'On Hold'
  | 'To Deliver and Bill'
  | 'To Bill'
  | 'To Deliver'
  | 'Completed'
  | 'Cancelled'
  | 'Closed';

// Payment Types
export interface PaymentRequest {
  name: string;
  grand_total: number;
  currency: string;
  status: PaymentStatus;
  payment_url?: string;
  razorpay_order_id?: string;
}

export type PaymentStatus = 'Requested' | 'Paid' | 'Failed' | 'Cancelled';

export interface PaymentEntry {
  name: string;
  payment_type: 'Receive';
  paid_amount: number;
  mode_of_payment: string;
  reference_no: string;
  reference_date: string;
  status: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
}

// Auth Types
export interface User {
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  customer_id?: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  home_page: string;
  full_name: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Wishlist Types
export interface WishlistItem {
  item_code: string;
  added_at: Date;
}

// Search Types
export interface SearchResult {
  items: Product[];
  total_results: number;
  page: number;
  page_size: number;
}
