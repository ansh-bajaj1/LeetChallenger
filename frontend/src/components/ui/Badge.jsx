import clsx from 'clsx';

const toneStyles = {
  neutral: 'bg-white/10 text-[var(--muted)]',
  accent: 'bg-[var(--accent)]/15 text-[var(--accent)]',
  success: 'bg-[var(--success)]/15 text-[var(--success)]',
  danger: 'bg-[var(--danger)]/15 text-[var(--danger)]',
  warning: 'bg-[var(--warning)]/15 text-[var(--warning)]',
};

export default function Badge({ label, tone = 'neutral', className = '' }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        toneStyles[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
