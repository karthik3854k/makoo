'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'hello@makoo.com',
      link: 'mailto:hello@makoo.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+91 98765 43210',
      link: 'tel:+919876543210',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: '123 Creative Avenue, Mumbai, India',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon - Sat: 10AM - 7PM',
    },
  ];

  return (
    <div className="page-container">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-brand-dark mb-4">Get in Touch</h1>
            <p className="text-lg text-brand-text-light max-w-xl mx-auto">
              Have a question or need help? We&apos;d love to hear from you.
              Reach out and we&apos;ll respond as soon as we can.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-brand-gray-dark/30 p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={24} className="text-brand-primary" />
              <h2 className="text-xl font-semibold text-brand-dark">Send us a message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-dark">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-dark">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-dark">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone"
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-dark">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="customization">Customization Request</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-dark">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={5}
                  className="input-field resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="bg-brand-gray/30 rounded-xl p-5 flex gap-4"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                    <info.icon size={20} className="text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-brand-dark">{info.title}</h3>
                    {info.link ? (
                      <a href={info.link} className="text-sm text-brand-primary hover:underline">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-brand-text-light">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Teaser */}
            <div className="bg-brand-dark rounded-2xl p-6 md:p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {[
                  'How long does shipping take?',
                  'Can I return customized products?',
                  'Do you offer bulk orders?',
                ].map((q) => (
                  <div key={q} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                    <span className="text-white/80">{q}</span>
                    <span className="text-brand-primary">→</span>
                  </div>
                ))}
              </div>
              <a href="/faqs" className="btn-primary bg-brand-primary w-full mt-6 justify-center">
                View All FAQs
              </a>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-brand-dark mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {['Instagram', 'Facebook', 'Twitter', 'YouTube'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-brand-gray rounded-lg flex items-center justify-center text-brand-text-muted hover:bg-brand-primary hover:text-white transition-colors"
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
