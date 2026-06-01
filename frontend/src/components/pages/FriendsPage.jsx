import { MessageCircle, Swords, Users } from 'lucide-react';
import Badge from '../ui/Badge';
import BentoCard from '../ui/BentoCard';
import SectionHeader from '../ui/SectionHeader';

const requests = [
  { name: 'Nia K', handle: '@nia.k', status: 'Online', streak: 21 },
  { name: 'Zane R', handle: '@zane.r', status: 'Away', streak: 16 },
];

const friends = [
  { name: 'Riya Jain', handle: '@riya', status: 'Online', streak: 42 },
  { name: 'Samir K', handle: '@samir', status: 'Do not disturb', streak: 33 },
  { name: 'Luca T', handle: '@luca', status: 'Online', streak: 28 },
];

const suggested = [
  { name: 'Eva Wu', handle: '@eva.w', status: 'Online', streak: 36 },
  { name: 'Carlos M', handle: '@carlos.m', status: 'Offline', streak: 14 },
];

function FriendCard({ friend, actions }) {
  return (
    <BentoCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{friend.name}</p>
          <p className="text-xs text-[var(--muted)]">{friend.handle}</p>
        </div>
        <Badge label={friend.status} tone={friend.status === 'Online' ? 'success' : 'neutral'} />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{friend.streak} day streak</span>
        <Badge label="Consistent" tone="accent" />
      </div>
      <div className="flex flex-wrap gap-2">{actions}</div>
    </BentoCard>
  );
}

export default function FriendsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Friends" subtitle="Build a curated circle of competitive coders." />

      <div className="grid gap-4 lg:grid-cols-3">
        <FriendCard
          friend={requests[0]}
          actions={
            <>
              <button className="rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white">
                Accept
              </button>
              <button className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]">
                Decline
              </button>
            </>
          }
        />
        <FriendCard
          friend={requests[1]}
          actions={
            <>
              <button className="rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white">
                Accept
              </button>
              <button className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]">
                Decline
              </button>
            </>
          }
        />
        <BentoCard className="flex flex-col items-center justify-center text-center">
          <Users className="h-6 w-6 text-[var(--muted)]" />
          <p className="mt-3 text-sm font-medium">2 new requests</p>
          <p className="text-xs text-[var(--muted)]">Approve your latest invitations.</p>
        </BentoCard>
      </div>

      <SectionHeader title="Accepted mates" subtitle="Quick access to your closest collaborators." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {friends.map((friend) => (
          <FriendCard
            key={friend.handle}
            friend={friend}
            actions={
              <>
                <button className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs text-white">
                  <MessageCircle className="h-3 w-3" />
                  Compare
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-3 py-2 text-xs text-white">
                  <Swords className="h-3 w-3" />
                  Challenge
                </button>
              </>
            }
          />
        ))}
      </div>

      <SectionHeader title="Suggested coders" subtitle="High-signal profiles based on your pace." />
      <div className="grid gap-4 md:grid-cols-2">
        {suggested.map((friend) => (
          <FriendCard
            key={friend.handle}
            friend={friend}
            actions={
              <>
                <button className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]">
                  View profile
                </button>
                <button className="rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white">
                  Add friend
                </button>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
