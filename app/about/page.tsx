'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="page-container">
      <div className="section-container">
        {/* Hero */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">
              Crafting Creativity,
              <br />
              <span className="text-gradient">One Product at a Time</span>
            </h1>
            <p className="text-lg text-brand-text-light max-w-2xl mx-auto">
              Makoo is passionate about helping you express your creativity through beautiful,
              personalized DIY products and handmade crafts.
            </p>
          </motion.div>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Our Story</h2>
            <div className="space-y-4 text-brand-text-light">
              <p>
                Founded in 2020, Makoo started with a simple idea: everyone deserves to create
                something beautiful. We began as a small team of craft enthusiasts who wanted to
                share our love for DIY and personalization.
              </p>
              <p>
                Today, we&apos;ve grown into a community of thousands of creators who use our products
                to make unique gifts, decorations, and keepsakes. From DIY painting kits to
                personalized wooden products, every item in our collection is designed to spark
                joy and creativity.
              </p>
              <p>
                Our mission is to make creativity accessible to everyone. Whether you&apos;re a
                seasoned artist or someone who&apos;s never picked up a paintbrush, we have something
                for you.
              </p>
            </div>
          </div>
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/6032662/pexels-photo-6032662.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="DIY Crafts"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-brand-dark text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality First',
                description: 'We use only premium materials in our products, ensuring that your creations last for years.',
              },
              {
                title: 'Eco-Friendly',
                description: 'Sustainability matters. Our packaging is recyclable, and we source materials responsibly.',
              },
              {
                title: 'Community',
                description: 'We believe in the power of creativity to bring people together. Join our crafting community!',
              },
            ].map((value, idx) => (
              <div key={idx} className="card p-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl text-brand-primary">{idx + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-2">{value.title}</h3>
                <p className="text-brand-text-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-brand-dark rounded-3xl p-8 md:p-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10,000+', label: 'Happy Customers' },
              { value: '500+', label: 'Products' },
              { value: '50+', label: 'Cities Served' },
              { value: '4.9/5', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-dark mb-4">Meet Our Team</h2>
          <p className="text-brand-text-light mb-12">The passionate people behind Makoo</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Priya Sharma', role: 'Founder & CEO', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300' },
              { name: 'Rahul Patel', role: 'Head of Design', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300' },
              { name: 'Anita Kumari', role: 'Product Manager', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300' },
              { name: 'Vikram Singh', role: 'Operations', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300' },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold text-brand-dark">{member.name}</h3>
                <p className="text-sm text-brand-text-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
