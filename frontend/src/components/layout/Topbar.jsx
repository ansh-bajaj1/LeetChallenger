import { Bell, ChevronDown, Inbox, Menu, Plus, Search } from 'lucide-react';

function IconButton({ icon: Icon, badge, label }) {
  return (
    <button
      type="button"
      className="relative rounded-xl border border-[var(--border)] bg-white/5 p-2 text-[var(--muted)] transition hover:text-white"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
      {badge ? (
        <span className="absolute -right-1 -top-1 rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export default function Topbar({ onMenuClick, onQuickAction, notifications, inboxCount, user }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl border border-[var(--border)] bg-white/5 p-2 text-[var(--muted)] transition hover:text-white lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white/5 py-2.5 pl-11 pr-4 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
              placeholder="Search profiles, problems, contests..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onQuickAction}
            className="hidden items-center gap-2 rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white shadow-elevated transition hover:translate-y-[-1px] md:flex"
          >
            <Plus className="h-4 w-4" />
            New challenge
          </button>
          <IconButton icon={Inbox} badge={inboxCount} label="Challenge inbox" />
          <IconButton icon={Bell} badge={notifications} label="Notifications" />
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white/5 px-3 py-2 text-sm text-[var(--muted)] transition hover:text-white"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)]/20 text-xs font-semibold text-[var(--accent)]">
              {(user && user.name
                ? user.name
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                : 'LT')}
            </div>
            <span className="hidden sm:inline">{user?.name || 'LeetCode Tracer'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
