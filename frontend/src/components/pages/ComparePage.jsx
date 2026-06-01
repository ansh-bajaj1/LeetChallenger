import { ArrowUpRight, GitCompare, Shield, Swords, Trophy } from 'lucide-react';
import Badge from '../ui/Badge';
import BentoCard from '../ui/BentoCard';
import ProgressBar from '../ui/ProgressBar';
import SectionHeader from '../ui/SectionHeader';

const comparisonMetrics = [
  { label: 'Total solved', me: 1284, other: 1121 },
  { label: 'Hard solved', me: 214, other: 176 },
  { label: 'Acceptance rate', me: 68, other: 62 },
  { label: 'Contest rating', me: 1940, other: 1785 },
];

const radarValues = [0.8, 0.65, 0.9, 0.7, 0.6];

function MetricDiff({ label, me, other }) {
  const diff = me - other;
  const tone = diff >= 0 ? 'success' : 'danger';
  const formatted = `${diff >= 0 ? '+' : ''}${diff}`;

  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white/5 px-3 py-2">
      <div>
        <p className="text-xs text-[var(--muted)]">{label}</p>
        <p className="text-sm font-medium">
          {me} vs {other}
        </p>
      </div>
      <Badge label={formatted} tone={tone} />
    </div>
  );
}

function RadarChart() {
  const points = radarValues
    .map((value, index) => {
      const angle = (Math.PI * 2 * index) / radarValues.length - Math.PI / 2;
      const radius = 48 * value;
      const x = 60 + Math.cos(angle) * radius;
      const y = 60 + Math.sin(angle) * radius;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 120 120" className="h-32 w-full">
      <polygon points="60,12 108,40 92,96 28,96 12,40" fill="rgba(106,169,255,0.08)" />
      <polygon points={points} fill="rgba(106,169,255,0.25)" stroke="#6aa9ff" strokeWidth="2" />
    </svg>
  );
}

export default function ComparePage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Compare profiles"
        subtitle="Side-by-side analytics that call out the edge."
        actions={<Badge label="Live diff" tone="accent" />}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <BentoCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Search competitors</p>
              <p className="text-xs text-[var(--muted)]">Add up to 3 profiles</p>
            </div>
            <GitCompare className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <input
            className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--text)] outline-none"
            placeholder="Search username, rank, or invitation"
          />
          <div className="flex flex-wrap gap-2">
            {['@eva_w', '@devon.k', '@jinny.s'].map((name) => (
              <Badge key={name} label={name} tone="neutral" />
            ))}
          </div>
        </BentoCard>

        <BentoCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Edge summary</p>
              <p className="text-xs text-[var(--muted)]">Weighted performance</p>
            </div>
            <Trophy className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-white/5 p-4">
            <p className="text-xs text-[var(--muted)]">Winner</p>
            <p className="mt-2 text-xl font-semibold">Avery Chen</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted)]">
              <span>Lead by</span>
              <Badge label="+4.8%" tone="success" />
            </div>
          </div>
          <div className="space-y-3">
            <MetricDiff label="Consistency" me={92} other={88} />
            <MetricDiff label="Contest pace" me={84} other={78} />
          </div>
        </BentoCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BentoCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">You</p>
              <p className="text-xs text-[var(--muted)]">Avery Chen</p>
            </div>
            <Badge label="Pro" tone="accent" />
          </div>
          <div className="space-y-3">
            {comparisonMetrics.map((metric) => (
              <MetricDiff key={metric.label} {...metric} other={metric.other} me={metric.me} />
            ))}
          </div>
        </BentoCard>

        <BentoCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Competitor</p>
              <p className="text-xs text-[var(--muted)]">Eva Wu</p>
            </div>
            <Badge label="Challenger" tone="neutral" />
          </div>
          <div className="space-y-3">
            {comparisonMetrics.map((metric) => (
              <MetricDiff key={metric.label} {...metric} other={metric.me} me={metric.other} />
            ))}
          </div>
        </BentoCard>

        <BentoCard className="flex flex-col items-center justify-center text-center">
          <RadarChart />
          <p className="mt-3 text-sm font-medium">Skill radar</p>
          <p className="text-xs text-[var(--muted)]">Algorithms, speed, accuracy, consistency, strategy</p>
        </BentoCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BentoCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Ranking visualization</p>
              <p className="text-xs text-[var(--muted)]">Season momentum</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-4 space-y-3">
            {['Week 20', 'Week 21', 'Week 22', 'Week 23'].map((week, index) => (
              <div key={week} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>{week}</span>
                  <span>#{140 - index * 4}</span>
                </div>
                <ProgressBar value={70 + index * 6} tone="accent" />
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Head-to-head drivers</p>
              <p className="text-xs text-[var(--muted)]">What creates the gap</p>
            </div>
            <Shield className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Hard problems solved', value: 78 },
              { label: 'Contest accuracy', value: 82 },
              { label: 'Speed per solution', value: 71 },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <ProgressBar value={item.value} tone="success" />
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      <BentoCard className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium">Launch a comparison challenge</p>
          <p className="text-xs text-[var(--muted)]">Convert this diff into a friendly sprint.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white">
          <Swords className="h-4 w-4" />
          Send challenge
        </button>
      </BentoCard>
    </div>
  );
}
