import { Crown, Sparkles, Trophy } from 'lucide-react';
import Badge from '../ui/Badge';
import BentoCard from '../ui/BentoCard';
import SectionHeader from '../ui/SectionHeader';

const podium = [
  { name: 'Riya Jain', points: 2580, rank: 1 },
  { name: 'Samir K', points: 2468, rank: 2 },
  { name: 'Avery Chen', points: 2314, rank: 3 },
];

const leaderboard = [
  { name: 'Luca T', points: 2210, delta: '+2' },
  { name: 'Eva W', points: 2198, delta: '+4' },
  { name: 'Kian P', points: 2142, delta: '-1' },
  { name: 'Nia K', points: 2098, delta: '+3' },
];

export default function RankingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Rankings" subtitle="Leaderboard intelligence at a glance." />

      <div className="grid gap-4 lg:grid-cols-3">
        {podium.map((leader) => (
          <BentoCard key={leader.name} className="relative overflow-hidden">
            <div className="absolute right-3 top-3">
              <Badge label={`#${leader.rank}`} tone="accent" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-lg font-semibold text-[var(--accent)]">
                {leader.name
                  .split(' ')
                  .map((word) => word[0])
                  .join('')}
              </div>
              <div>
                <p className="text-sm font-medium">{leader.name}</p>
                <p className="text-xs text-[var(--muted)]">{leader.points} pts</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-xs text-[var(--muted)]">Momentum</div>
              <Badge label="Rising" tone="success" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)]">
              <Crown className="h-3 w-3" />
              Weekly podium
            </div>
          </BentoCard>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <BentoCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Global leaderboard</p>
              <p className="text-xs text-[var(--muted)]">Top performers this season</p>
            </div>
            <Trophy className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-4 space-y-3">
            {leaderboard.map((leader, index) => (
              <div key={leader.name} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs text-[var(--muted)]">
                    {index + 4}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{leader.name}</p>
                    <p className="text-xs text-[var(--muted)]">{leader.points} pts</p>
                  </div>
                </div>
                <Badge label={leader.delta} tone={leader.delta.startsWith('+') ? 'success' : 'danger'} />
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Filters</p>
              <p className="text-xs text-[var(--muted)]">Tune the board</p>
            </div>
            <Sparkles className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-4 space-y-3">
            {['Global', 'Local', 'Contest', 'Friends only'].map((filter, index) => (
              <button
                key={filter}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                  index === 0 ? 'bg-white/10 text-white' : 'border border-[var(--border)] text-[var(--muted)]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
