import { Activity, Flame, GitCompare, Swords } from 'lucide-react';
import Badge from '../ui/Badge';
import BentoCard from '../ui/BentoCard';
import SectionHeader from '../ui/SectionHeader';

const timeline = [
  {
    title: 'Won a head-to-head challenge',
    detail: 'Beat @devon.k by 14 points',
    time: '3h ago',
    icon: Swords,
  },
  {
    title: 'Comparison report generated',
    detail: 'New delta insights ready',
    time: 'Yesterday',
    icon: GitCompare,
  },
  {
    title: 'Streak milestone unlocked',
    detail: '41 day streak',
    time: '2 days ago',
    icon: Flame,
  },
];

export default function ActivityPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Activity" subtitle="Every important signal, neatly sequenced." />

      <BentoCard className="space-y-4">
        {timeline.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[var(--muted)]">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-[var(--muted)]">{item.detail}</p>
              </div>
              <Badge label={item.time} tone="neutral" />
            </div>
          );
        })}
      </BentoCard>

      <div className="grid gap-4 md:grid-cols-2">
        <BentoCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Focus modes</p>
              <p className="text-xs text-[var(--muted)]">Optimized schedules</p>
            </div>
            <Activity className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-4 space-y-3">
            {['Morning sprint', 'Night owl', 'Weekend marathon'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs">
                <span>{item}</span>
                <Badge label="Active" tone="success" />
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Collaboration pulse</p>
              <p className="text-xs text-[var(--muted)]">Recent pair sessions</p>
            </div>
            <Swords className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-4 space-y-3">
            {['Graph design review', 'Contest prep sprint', 'DP bootcamp'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs">
                <span>{item}</span>
                <span className="text-[var(--muted)]">2h ago</span>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
