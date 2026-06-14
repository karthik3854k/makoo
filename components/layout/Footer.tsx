'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'DIY Painting Kits', href: '/products?category=painting' },
    { name: 'Wooden Products', href: '/products?category=wooden' },
    { name: 'Home Decor', href: '/products?category=decor' },
    { name: 'Personalized Gifts', href: '/products?category=gifts' },
    { name: 'Craft Materials', href: '/products?category=crafts' },
    { name: 'Resin Art', href: '/products?category=resin' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'FAQs', href: '/faqs' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Refund Policy', href: '/refund' },
  ],
};

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/makoo', icon: Instagram },
  { name: 'Facebook', href: 'https://facebook.com/makoo', icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com/makoo', icon: Twitter },
  { name: 'YouTube', href: 'https://youtube.com/makoo', icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      {/* Main Footer */}
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-brand-primary">Ma</span>
                <span>koo</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-xs">
              Create beautiful personalized products with our DIY kits. Express your creativity with Makoo.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:hello@makoo.com"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-brand-primary transition-colors"
              >
                <Mail size={16} />
                hello@makoo.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-brand-primary transition-colors"
              >
                <Phone size={16} />
                +91 98765 43210
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <span>123 Creative Avenue, Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-brand-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-brand-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-brand-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-brand-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              {new Date().getFullYear()} Makoo. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-brand-primary hover:text-white transition-all"
                  aria-label={social.name}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-white/60">We accept:</div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-white/10 rounded text-xs font-medium">VISA</div>
                <div className="px-2 py-1 bg-white/10 rounded text-xs font-medium">MC</div>
                <div className="px-2 py-1 bg-white/10 rounded text-xs font-medium">UPI</div>
                <div className="px-2 py-1 bg-white/10 rounded text-xs font-medium">GPay</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
