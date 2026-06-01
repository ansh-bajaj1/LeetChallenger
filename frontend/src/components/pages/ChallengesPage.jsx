import { useState } from 'react';
import { Calendar, Inbox, Send, Swords } from 'lucide-react';
import Badge from '../ui/Badge';
import BentoCard from '../ui/BentoCard';
import SectionHeader from '../ui/SectionHeader';

const inboxChallenges = [
  {
    id: 1,
    title: 'Graph Expedition #221',
    difficulty: 'Hard',
    sender: 'Eva W.',
    deadline: '2 days',
    status: 'New',
  },
  {
    id: 2,
    title: 'Binary Sprint #118',
    difficulty: 'Medium',
    sender: 'Kian P.',
    deadline: '5 days',
    status: 'In progress',
  },
];

const sentChallenges = [
  {
    id: 3,
    title: 'DP Marathon #042',
    difficulty: 'Hard',
    sender: 'Sent to Riya',
    deadline: '3 days',
    status: 'Awaiting',
  },
  {
    id: 4,
    title: 'Array Flow #311',
    difficulty: 'Easy',
    sender: 'Sent to Luca',
    deadline: '6 days',
    status: 'Accepted',
  },
];

const difficultyTone = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'danger',
};

function ChallengeCard({ challenge }) {
  return (
    <BentoCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">{challenge.title}</p>
          <p className="text-xs text-[var(--muted)]">{challenge.sender}</p>
        </div>
        <Badge label={challenge.difficulty} tone={difficultyTone[challenge.difficulty]} />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          <span>{challenge.deadline}</span>
        </div>
        <Badge label={challenge.status} tone="accent" />
      </div>
    </BentoCard>
  );
}

export default function ChallengesPage() {
  const [tab, setTab] = useState('inbox');
  const challenges = tab === 'inbox' ? inboxChallenges : sentChallenges;

  return (
    <div className="space-y-8">
      <SectionHeader title="Challenges" subtitle="Send focused sprints and keep your inbox clean." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <BentoCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Send a challenge</p>
              <p className="text-xs text-[var(--muted)]">Curate the perfect problem set</p>
            </div>
            <Swords className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="space-y-3">
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--text)] outline-none"
              placeholder="Recipient username"
            />
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--text)] outline-none"
              placeholder="Problem IDs (comma separated)"
            />
            <textarea
              rows={4}
              className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--text)] outline-none"
              placeholder="Add a personal note"
            />
          </div>
          <button className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white">
            Send challenge
          </button>
          <p className="text-xs text-[var(--muted)]">Challenges are private until accepted.</p>
        </BentoCard>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('inbox')}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                tab === 'inbox'
                  ? 'bg-white/10 text-white'
                  : 'border border-[var(--border)] text-[var(--muted)]'
              }`}
            >
              <Inbox className="h-4 w-4" />
              Inbox
            </button>
            <button
              type="button"
              onClick={() => setTab('sent')}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                tab === 'sent'
                  ? 'bg-white/10 text-white'
                  : 'border border-[var(--border)] text-[var(--muted)]'
              }`}
            >
              <Send className="h-4 w-4" />
              Sent
            </button>
          </div>

          {challenges.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          ) : (
            <BentoCard className="text-center">
              <p className="text-sm font-medium">Nothing here yet</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Your next challenge will appear right here.</p>
            </BentoCard>
          )}
        </div>
      </div>
    </div>
  );
}
