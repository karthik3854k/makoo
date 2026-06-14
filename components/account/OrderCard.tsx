'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ChevronRight } from 'lucide-react';
import type { SalesOrder } from '@/types';

const statusColors: Record<string, string> = {
  Draft: 'bg-brand-gray text-brand-text',
  'On Hold': 'bg-warning/20 text-warning',
  'To Deliver and Bill': 'bg-brand-primary/10 text-brand-primary',
  'To Bill': 'bg-brand-primary/10 text-brand-primary',
  'To Deliver': 'bg-brand-primary/10 text-brand-primary',
  Completed: 'bg-success/10 text-success',
  Cancelled: 'bg-error/10 text-error',
  Closed: 'bg-brand-gray text-brand-text-muted',
};

interface OrderCardProps {
  order: SalesOrder;
}

export default function OrderCard({ order }: OrderCardProps) {
  const date = order.transaction_date
    ? new Date(order.transaction_date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recent';

  const itemsPreview = order.items.slice(0, 2);
  const moreItems = order.items.length - 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-brand-gray-dark/30 p-5 hover:shadow-card transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-medium text-brand-dark">#{order.name}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-brand-gray text-brand-text'}`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-brand-text-muted">{date}</p>
        </div>
        <Link
          href={`/account/orders/${order.name}`}
          className="p-2 text-brand-text-muted hover:text-brand-primary hover:bg-brand-gray rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </Link>
      </div>

      <div className="flex items-center gap-3 py-3 border-y border-brand-gray-dark/30">
        <div className="w-12 h-12 bg-brand-gray rounded-lg flex items-center justify-center">
          <Package size={20} className="text-brand-text-muted" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-brand-dark truncate">
            {itemsPreview.map((i) => i.item_name).join(', ')}
            {moreItems > 0 && ` +${moreItems} more`}
          </p>
          <p className="text-xs text-brand-text-muted">{order.total_qty} items</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-sm text-brand-text-muted">Total</p>
        <p className="font-semibold text-brand-primary">
          Rs. {order.rounded_total?.toLocaleString() || order.base_grand_total?.toLocaleString() || '0'}
        </p>
      </div>
    </motion.div>
  );
}
