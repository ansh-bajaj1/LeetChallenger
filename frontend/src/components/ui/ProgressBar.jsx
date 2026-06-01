import clsx from 'clsx';

const toneStyles = {
  accent: 'bg-[var(--accent)]',
  success: 'bg-[var(--success)]',
  warning: 'bg-[var(--warning)]',
};

export default function ProgressBar({ value, tone = 'accent', className = '' }) {
  return (
    <div className={clsx('h-2 w-full rounded-full bg-white/10', className)}>
      <div className={clsx('h-full rounded-full transition-all', toneStyles[tone])} style={{ width: `${value}%` }} />
    </div>
  );
}
