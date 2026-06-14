import type {
  Product,
  ProductListResponse,
  Address,
  SalesOrder,
  PaymentRequest,
  PaymentEntry,
  User,
  AuthResponse,
  WebshopSettings,
} from '@/types';

const API_BASE = 'https://kalikajewels.shop';
const API_URL = `${API_BASE}/api`;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

class FrappeAPI {
  private sid: string | null = null;
  private csrfToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.sid = localStorage.getItem('frappe_sid');
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (this.sid) {
      headers['Cookie'] = `sid=${this.sid}`;
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const config: RequestInit = {
      method,
      headers: { ...this.getHeaders(), ...headers },
      credentials: 'include',
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: data });
  }

  async put<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: data });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  setSessionId(sid: string): void {
    this.sid = sid;
    if (typeof window !== 'undefined') {
      localStorage.setItem('frappe_sid', sid);
    }
  }

  clearSession(): void {
    this.sid = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('frappe_sid');
    }
  }
}

const api = new FrappeAPI();

export const productService = {
  async getList(params?: {
    search?: string;
    item_group?: string;
    brand?: string;
    start?: number;
    page_length?: number;
    filters?: Record<string, string>;
  }): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set('search', params.search);
    if (params?.item_group) queryParams.set('item_group', params.item_group);
    if (params?.brand) queryParams.set('brand', params.brand);
    if (params?.start !== undefined) queryParams.set('start', params.start.toString());
    if (params?.page_length) queryParams.set('page_length', params.page_length.toString());
    if (params?.filters) {
      queryParams.set('filters', JSON.stringify(params.filters));
    }

    const query = queryParams.toString();
    return api.get<ProductListResponse>(
      `/method/webshop.webshop.api.get_product_list${query ? `?${query}` : ''}`
    );
  },

  async getInfo(itemCode: string): Promise<{ message: Product }> {
    return api.get<{ message: Product }>(
      `/method/webshop.webshop.api.get_product_info?item_code=${encodeURIComponent(itemCode)}`
    );
  },

  async getRelated(itemCode: string): Promise<{ message: { items: Product[] } }> {
    return api.get<{ message: { items: Product[] } }>(
      `/method/webshop.webshop.api.get_related_items?item_code=${encodeURIComponent(itemCode)}`
    );
  },
};

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/method/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ usr: email, pwd: password }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const cookies = response.headers.get('set-cookie') || '';
    const sidMatch = cookies.match(/sid=([^;]+)/);
    if (sidMatch) {
      api.setSessionId(sidMatch[1]);
    }

    return response.json();
  },

  async register(data: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone?: string;
  }): Promise<{ message: { name: string } }> {
    const customerData = {
      name: data.email,
      email_id: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      mobile_no: data.phone,
      customer_type: 'Individual',
    };

    return api.post('/resource/Customer', customerData);
  },

  async logout(): Promise<void> {
    await api.get('/method/logout');
    api.clearSession();
  },

  async getCurrentUser(): Promise<{ message: User }> {
    return api.get('/method/frappe.auth.get_logged_user');
  },

  async getSettings(): Promise<{ message: WebshopSettings }> {
    return api.get('/method/ecommerce_integrations.erpnext_ui.pages.product.get_website_settings');
  },
};

export const addressService = {
  async list(): Promise<{ data: Address[] }> {
    return api.get('/resource/Address?fields=["*"]&filters=[["address_type","=","Billing"]]');
  },

  async get(name: string): Promise<{ data: Address }> {
    return api.get(`/resource/Address/${encodeURIComponent(name)}`);
  },

  async create(data: Omit<Address, 'name'>): Promise<{ data: Address }> {
    return api.post('/resource/Address', data as unknown as Record<string, unknown>);
  },

  async update(name: string, data: Partial<Address>): Promise<{ data: Address }> {
    return api.put(`/resource/Address/${encodeURIComponent(name)}`, data as unknown as Record<string, unknown>);
  },

  async delete(name: string): Promise<void> {
    await api.delete(`/resource/Address/${encodeURIComponent(name)}`);
  },
};

export const orderService = {
  async create(data: {
    customer: string;
    items: Array<{
      item_code: string;
      qty: number;
      rate: number;
      custom_data?: string;
    }>;
    shipping_address_name?: string;
    billing_address_name?: string;
  }): Promise<{ data: SalesOrder }> {
    return api.post('/resource/Sales Order', data as unknown as Record<string, unknown>);
  },

  async list(customer: string): Promise<{ data: SalesOrder[] }> {
    return api.get(
      `/resource/Sales Order?fields=["*"]&filters=[["customer","=","${customer}"]]&order_by="creation desc"`
    );
  },

  async get(name: string): Promise<{ data: SalesOrder }> {
    return api.get(`/resource/Sales Order/${encodeURIComponent(name)}`);
  },
};

export const paymentService = {
  async createPaymentRequest(orderName: string): Promise<{ data: PaymentRequest }> {
    return api.post('/resource/Payment Request', {
      reference_doctype: 'Sales Order',
      reference_name: orderName,
      payment_request_type: 'Outward',
    });
  },

  async createPaymentEntry(data: {
    payment_request: string;
    paid_amount: number;
    mode_of_payment: string;
    reference_no: string;
  }): Promise<{ data: PaymentEntry }> {
    return api.post('/resource/Payment Entry', data as unknown as Record<string, unknown>);
  },

  async getPaymentRequest(name: string): Promise<{ data: PaymentRequest }> {
    return api.get(`/resource/Payment Request/${encodeURIComponent(name)}`);
  },
};

export type { FrappeAPI };
export { api };
