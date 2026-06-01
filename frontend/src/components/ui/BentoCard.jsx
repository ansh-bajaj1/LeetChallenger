import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function BentoCard({ className = '', children, hover = true }) {
  return (
    <motion.div
      className={clsx('surface-card rounded-2xl border border-[var(--border)] p-4', className)}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
