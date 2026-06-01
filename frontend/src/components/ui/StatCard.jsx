import Badge from './Badge';
import BentoCard from './BentoCard';
import AnimatedNumber from './AnimatedNumber';

const toneStyles = {
  blue: 'bg-[var(--accent)]/15 text-[var(--accent)]',
  violet: 'bg-[var(--accent-2)]/15 text-[var(--accent-2)]',
  success: 'bg-[var(--success)]/15 text-[var(--success)]',
  warning: 'bg-[var(--warning)]/15 text-[var(--warning)]',
};

export default function StatCard({ label, value, icon: Icon, delta, helper, tone = 'blue', suffix = '' }) {
  return (
    <BentoCard>
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneStyles[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {delta ? (
          <Badge
            label={delta}
            tone={delta.startsWith('+') ? 'success' : 'danger'}
            className="text-[11px]"
          />
        ) : null}
      </div>
      <div className="mt-4">
        <p className="text-sm text-[var(--muted)]">{label}</p>
        <p className="mt-1 text-2xl font-semibold">
          <AnimatedNumber value={value} suffix={suffix} />
        </p>
        {helper ? <p className="mt-2 text-xs text-[var(--muted)]">{helper}</p> : null}
      </div>
    </BentoCard>
  );
}
