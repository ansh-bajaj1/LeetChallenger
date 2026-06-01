import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, LogOut, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';

const transition = { type: 'spring', stiffness: 220, damping: 26 };

function SidebarContent({
  items,
  activeId,
  onNavigate,
  user,
  theme,
  onToggleTheme,
  collapsed,
  onToggleCollapse,
}) {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between px-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="soft-ring flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-strong)]">
            <span className="font-display text-lg">LC</span>
          </div>
          {!collapsed && (
            <div>
              <p className="font-display text-lg leading-tight">LeetChallenger</p>
              <p className="text-xs text-[var(--muted)]">Developer platform</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden rounded-xl border border-[var(--border)] bg-white/5 p-2 text-[var(--muted)] transition hover:text-white lg:inline-flex"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={clsx(
                'relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-[var(--muted)] hover:bg-white/5 hover:text-white'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="navActive"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-[var(--accent)]"
                  transition={transition}
                />
              )}
              <Icon className="h-4 w-4" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="space-y-4 border-t border-[var(--border)] px-4 pb-6 pt-4">
        <div className="rounded-2xl border border-[var(--border)] bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-sm font-semibold text-[var(--accent)]">
              {user.name
                .split(' ')
                .map((word) => word[0])
                .join('')}
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-[var(--muted)]">@{user.handle}</p>
              </div>
            )}
          </div>
        </div>

        <div className={clsx('flex items-center gap-2', collapsed && 'flex-col')}>
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white/5 px-3 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-white"
          >
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {!collapsed && <span>{theme === 'dark' ? 'Dark' : 'Light'} mode</span>}
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white/5 px-3 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({
  items,
  activeId,
  onNavigate,
  open,
  onClose,
  user,
  theme,
  onToggleTheme,
  collapsed,
  onToggleCollapse,
}) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={transition}
            >
              <SidebarContent
                items={items}
                activeId={activeId}
                onNavigate={onNavigate}
                user={user}
                theme={theme}
                onToggleTheme={onToggleTheme}
                collapsed={false}
                onToggleCollapse={onToggleCollapse}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 hidden border-r border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-xl lg:flex',
          collapsed ? 'w-24' : 'w-72'
        )}
      >
        <SidebarContent
          items={items}
          activeId={activeId}
          onNavigate={onNavigate}
          user={user}
          theme={theme}
          onToggleTheme={onToggleTheme}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </aside>
    </>
  );
}
