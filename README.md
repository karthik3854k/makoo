# Makoo - DIY Customization E-Commerce Platform

A modern, production-ready e-commerce website for DIY customization products built with Next.js 15, TypeScript, Tailwind CSS, and Frappe ERPNext API integration.

## Features

- Product catalog with filtering and search
- Product customization with live preview
- Shopping cart with persistent storage
- Checkout flow with address management
- Razorpay payment integration
- Customer authentication
- Wishlist functionality
- Order history dashboard
- Responsive, mobile-first design
- Apple-inspired premium UI

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Backend**: Frappe ERPNext + Frappe Webshop API
- **Payment**: Razorpay

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Frappe ERPNext instance (or use the demo endpoint)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/makoo.git
cd makoo
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
FRAPPE_API_URL=https://kalikajewels.shop
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxx
RAZORPAY_SECRET=your_razorpay_secret
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/              # About page
│   ├── account/            # User account pages
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout flow
│   ├── contact/            # Contact page
│   ├── login/              # Login page
│   ├── product/            # Product detail pages
│   ├── products/           # Product listing
│   ├── register/           # Registration page
│   └── wishlist/           # Wishlist page
├── components/
│   ├── account/            # Account-related components
│   ├── cart/               # Cart components
│   ├── common/             # Shared components
│   ├── customization/      # Product customization
│   ├── layout/             # Navbar, Footer
│   ├── product/            # Product components
│   └── ui/                 # Shadcn UI components
├── services/               # API service layer
│   └── frappe.ts           # Frappe ERPNext API
├── stores/                 # Zustand stores
│   └── index.ts            # Cart, Auth, Wishlist, UI stores
├── types/                  # TypeScript types
│   └── index.ts
└── hooks/                  # Custom React hooks
```

## API Integration

### Frappe ERPNext Endpoints

The application uses the following Frappe Webshop APIs:

- **Product List**: `GET /api/method/webshop.webshop.api.get_product_list`
- **Product Info**: `GET /api/method/webshop.webshop.api.get_product_info`
- **Login**: `POST /api/method/login`
- **Customer Registration**: `POST /api/resource/Customer`
- **Address Management**: `CRUD /api/resource/Address`
- **Sales Orders**: `POST /api/resource/Sales Order`
- **Payment Requests**: `POST /api/resource/Payment Request`

### Example API Calls

```typescript
// Get product list
const products = await productService.getList({
  search: 'painting kit',
  item_group: 'DIY Kits',
  page_length: 24
});

// Create order
const order = await orderService.create({
  customer: 'customer@example.com',
  items: [
    { item_code: 'PAINT001', qty: 1, rate: 1499 }
  ],
  shipping_address_name: 'ADDR001'
});
```

## Customization Features

The product customization system supports:

- **Text Customization**: Personalized text/names with font style selection
- **Color Selection**: Multiple color options for engraving/printing
- **Image Upload**: Custom image upload for products
- **Live Preview**: Real-time preview of customization

## Payment Integration

Razorpay integration for secure payments:

- Credit/Debit Cards
- UPI
- Net Banking
- Wallets
- Cash on Delivery

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub

2. Connect your repository to Vercel

3. Configure environment variables in Vercel dashboard

4. Deploy

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FRAPPE_API_URL` | Frappe ERPNext API endpoint | Yes |
| `NEXT_PUBLIC_RAZORPAY_KEY` | Razorpay public key | Yes |
| `RAZORPAY_SECRET` | Razorpay secret key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email hello@makoo.com or join our Discord channel.
