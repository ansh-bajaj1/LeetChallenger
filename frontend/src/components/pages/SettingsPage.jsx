import { Bell, Lock, Palette } from 'lucide-react';
import Badge from '../ui/Badge';
import BentoCard from '../ui/BentoCard';
import SectionHeader from '../ui/SectionHeader';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Settings" subtitle="Tune the platform to your workflow." />

      <div className="grid gap-4 lg:grid-cols-3">
        <BentoCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Profile visibility</p>
              <p className="text-xs text-[var(--muted)]">Control who can compare you</p>
            </div>
            <Lock className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="space-y-2">
            {['Public', 'Friends only', 'Invite only'].map((item, index) => (
              <button
                key={item}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                  index === 1 ? 'bg-white/10 text-white' : 'border border-[var(--border)] text-[var(--muted)]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </BentoCard>

        <BentoCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-[var(--muted)]">Pick your signal density</p>
            </div>
            <Bell className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="space-y-3">
            {['Contest alerts', 'Challenge invites', 'Friend progress'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs">
                <span>{item}</span>
                <Badge label="On" tone="success" />
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Workspace style</p>
              <p className="text-xs text-[var(--muted)]">Choose your accents</p>
            </div>
            <Palette className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {['Electric', 'Violet', 'Emerald', 'Amber'].map((tone, index) => (
              <Badge key={tone} label={tone} tone={index === 0 ? 'accent' : 'neutral'} />
            ))}
          </div>
          <button className="w-full rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white">
            Save preferences
          </button>
        </BentoCard>
      </div>
    </div>
  );
}
