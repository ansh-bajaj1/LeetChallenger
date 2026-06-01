import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  Code2,
  Crown,
  Flame,
  Gauge,
  Rocket,
  Swords,
  Target,
  Trophy,
} from 'lucide-react';
import AvatarStack from '../ui/AvatarStack';
import Badge from '../ui/Badge';
import BentoCard from '../ui/BentoCard';
import ProgressBar from '../ui/ProgressBar';
import SectionHeader from '../ui/SectionHeader';
import StatCard from '../ui/StatCard';

const stats = [
  {
    label: 'Total solved',
    value: 1284,
    delta: '+32',
    icon: Code2,
    helper: 'Last 30 days',
    tone: 'blue',
  },
  {
    label: 'Acceptance rate',
    value: 68,
    suffix: '%',
    delta: '+4%',
    icon: Gauge,
    helper: 'Healthy efficiency',
    tone: 'success',
  },
  {
    label: 'Current streak',
    value: 41,
    suffix: ' days',
    delta: '+7',
    icon: Flame,
    helper: 'Weekly momentum',
    tone: 'warning',
  },
  {
    label: 'Global rank',
    value: 128,
    delta: '-14',
    icon: Trophy,
    helper: 'Top 1.2%',
    tone: 'violet',
  },
  {
    label: 'Hard solved',
    value: 214,
    delta: '+6',
    icon: Swords,
    helper: 'Critical ladder',
    tone: 'blue',
  },
  {
    label: 'Contest rating',
    value: 1940,
    delta: '+48',
    icon: Crown,
    helper: 'Diamond sprint',
    tone: 'success',
  },
];

const activityFeed = [
  {
    title: 'Solved "Palindromic Paths"',
    detail: 'Hard - 28 min',
    time: '28m ago',
  },
  {
    title: 'Challenge accepted from @eva_w',
    detail: 'Graph mastery set',
    time: '2h ago',
  },
  {
    title: 'New personal best in Biweekly 118',
    detail: 'Ranked #112',
    time: 'Yesterday',
  },
  {
    title: 'Streak milestone unlocked',
    detail: '40 day streak',
    time: '2 days ago',
  },
];

const contests = [
  { name: 'Weekly 412', date: 'Sat 10:30', label: 'Ranked' },
  { name: 'Biweekly 118', date: 'Sun 14:00', label: 'Practice' },
  { name: 'Algo Sprint', date: 'Tue 20:00', label: 'Invite' },
];

const goals = [
  { label: 'Finish 12 dynamic programming drills', progress: 72 },
  { label: 'Ship 5 hard solutions', progress: 48 },
  { label: 'Maintain 95% weekly streak', progress: 86 },
];

const languages = [
  { name: 'TypeScript', value: 62 },
  { name: 'Python', value: 22 },
  { name: 'Go', value: 10 },
  { name: 'C++', value: 6 },
];

const leaderboard = [
  { name: 'Riya J.', points: 2580 },
  { name: 'Samir K.', points: 2468 },
  { name: 'Avery C.', points: 2314 },
];

const heatmap = Array.from({ length: 84 }, (_, index) => {
  const intensity = [0.1, 0.25, 0.45, 0.7, 0.9][index % 5];
  return intensity;
});

function Sparkline({ points }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 200;
      const y = 64 - ((point - min) / (max - min || 1)) * 48;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 200 64" className="h-16 w-full">
      <path d={path} fill="none" stroke="url(#spark)" strokeWidth="3" />
      <defs>
        <linearGradient id="spark" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#6aa9ff" />
          <stop offset="100%" stopColor="#8c6bff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function DashboardPage({ user }) {
  return (
    <div className="space-y-8">
      <div className="gradient-border shadow-elevated">
        <div className="gradient-border-inner p-6 md:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-[var(--muted)]">Welcome back, {user.name}</p>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl">
                Your momentum feels <span className="text-gradient">elite</span> this week.
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
                You are trending above your average for medium and hard problems. Keep the focus on graph
                challenges and contests.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-[var(--border)] bg-white/5 px-4 py-3">
                  <p className="text-xs text-[var(--muted)]">Current streak</p>
                  <p className="mt-1 text-lg font-semibold">{user.streak} days</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white/5 px-4 py-3">
                  <p className="text-xs text-[var(--muted)]">Global rank</p>
                  <p className="mt-1 text-lg font-semibold">#{user.rank}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white/5 px-4 py-3">
                  <p className="text-xs text-[var(--muted)]">Contest rating</p>
                  <p className="mt-1 text-lg font-semibold">{user.rating}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-elevated">
                Start a challenge
              </button>
              <button className="rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--muted)]">
                View weekly report
              </button>
              <div className="rounded-2xl border border-[var(--border)] bg-white/5 px-4 py-3">
                <p className="text-xs text-[var(--muted)]">Focus lane</p>
                <p className="mt-1 text-sm font-semibold">Graphs + Sliding Window</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <SectionHeader
            title="Analytics overview"
            subtitle="Dense insights without the clutter."
            actions={<Badge label="Live sync" tone="success" />}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <BentoCard>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Problem heatmap</p>
                <Badge label="Last 12 weeks" tone="neutral" />
              </div>
              <div className="mt-4 grid grid-cols-14 gap-1">
                {heatmap.map((level, index) => (
                  <div
                    key={index}
                    className="h-3 w-3 rounded-[4px] bg-[var(--accent)]"
                    style={{ opacity: level }}
                  />
                ))}
              </div>
              <p className="mt-4 text-xs text-[var(--muted)]">Peak hours: Tue, Thu, Sun</p>
            </BentoCard>

            <BentoCard>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Contest activity</p>
                <Badge label="+12%" tone="success" />
              </div>
              <div className="mt-4">
                <Sparkline points={[12, 18, 14, 28, 32, 26, 38]} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Avg placement</span>
                <span className="text-white">Top 4%</span>
              </div>
            </BentoCard>

            <BentoCard>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Progress curve</p>
                <Badge label="Weekly" tone="accent" />
              </div>
              <div className="mt-4">
                <Sparkline points={[8, 10, 12, 15, 18, 21, 25]} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Avg solved</span>
                <span className="text-white">4.3 / day</span>
              </div>
            </BentoCard>

            <BentoCard>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Language mix</p>
                <Badge label="Top 4" tone="neutral" />
              </div>
              <div className="mt-4 space-y-3">
                {languages.map((lang) => (
                  <div key={lang.name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                      <span>{lang.name}</span>
                      <span>{lang.value}%</span>
                    </div>
                    <ProgressBar value={lang.value} tone="accent" />
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>

          <SectionHeader title="Recent activity" subtitle="Your freshest highlights across the platform." />
          <BentoCard>
            <div className="space-y-4">
              {activityFeed.map((item) => (
                <div key={item.title} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-[var(--muted)]">{item.detail}</p>
                  </div>
                  <span className="text-xs text-[var(--muted)]">{item.time}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>

        <div className="space-y-6">
          <SectionHeader title="Right now" subtitle="Actionable context." />

          <BentoCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Upcoming contests</p>
                <p className="text-xs text-[var(--muted)]">Next 7 days</p>
              </div>
              <Calendar className="h-4 w-4 text-[var(--muted)]" />
            </div>
            <div className="mt-4 space-y-3">
              {contests.map((contest) => (
                <div key={contest.name} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{contest.name}</p>
                    <p className="text-xs text-[var(--muted)]">{contest.date}</p>
                  </div>
                  <Badge label={contest.label} tone="accent" />
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Coding goals</p>
                <p className="text-xs text-[var(--muted)]">Sprint #24</p>
              </div>
              <Target className="h-4 w-4 text-[var(--muted)]" />
            </div>
            <div className="mt-4 space-y-4">
              {goals.map((goal) => (
                <div key={goal.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                    <span>{goal.label}</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <ProgressBar value={goal.progress} tone="success" />
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Leaderboard preview</p>
                <p className="text-xs text-[var(--muted)]">Global top three</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[var(--muted)]" />
            </div>
            <div className="mt-4 space-y-3">
              {leaderboard.map((leader, index) => (
                <div key={leader.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-xs text-[var(--muted)]">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium">{leader.name}</p>
                  </div>
                  <span className="text-xs text-[var(--muted)]">{leader.points} pts</span>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Social pulse</p>
                <p className="text-xs text-[var(--muted)]">Active collaborators</p>
              </div>
              <Rocket className="h-4 w-4 text-[var(--muted)]" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <AvatarStack
                people={[
                  { name: 'Riya Jain', color: 'rgba(106,169,255,0.3)' },
                  { name: 'Samir K', color: 'rgba(140,107,255,0.3)' },
                  { name: 'Luca T', color: 'rgba(56,217,149,0.3)' },
                  { name: 'Inez R', color: 'rgba(247,185,85,0.3)' },
                  { name: 'Yara S', color: 'rgba(255,107,107,0.3)' },
                ]}
              />
              <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white/5 px-3 py-2 text-xs text-[var(--muted)]">
                View all
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </BentoCard>
        </div>
      </div>

      <SectionHeader title="Experimental labs" subtitle="Fast ideas in motion." />
      <div className="grid gap-4 lg:grid-cols-3">
        <BentoCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">AI coach pulse</p>
              <p className="text-xs text-[var(--muted)]">Syncing difficulty spikes</p>
            </div>
            <BarChart3 className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded-full bg-white/10" />
            <div className="h-3 w-4/5 rounded-full bg-white/10" />
            <div className="h-3 w-3/5 rounded-full bg-white/10" />
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">Model refresh in progress</p>
        </BentoCard>

        <BentoCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Challenge studio</p>
              <p className="text-xs text-[var(--muted)]">Top creators this week</p>
            </div>
            <Swords className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-4 space-y-3">
            {['Graph Blaster', 'DP Minimalism', 'Binary Sprint'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs text-[var(--muted)]">
                <span>{item}</span>
                <span className="text-white">+128</span>
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Rank impact</p>
              <p className="text-xs text-[var(--muted)]">Forecast next contest</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-white">+34</p>
              <p className="text-xs text-[var(--muted)]">Projected rank gain</p>
            </div>
            <Badge label="Optimistic" tone="success" />
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
