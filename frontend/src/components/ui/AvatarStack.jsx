export default function AvatarStack({ people, max = 4 }) {
  const visible = people.slice(0, max);
  const remaining = people.length - visible.length;

  return (
    <div className="flex items-center">
      {visible.map((person, index) => (
        <div
          key={`${person.name}-${index}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-xs font-semibold"
          style={{
            background: person.color,
            marginLeft: index === 0 ? 0 : -8,
          }}
        >
          {person.name
            .split(' ')
            .map((word) => word[0])
            .join('')}
        </div>
      ))}
      {remaining > 0 ? (
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white/5 text-xs text-[var(--muted)]" style={{ marginLeft: -8 }}>
          +{remaining}
        </div>
      ) : null}
    </div>
  );
}
