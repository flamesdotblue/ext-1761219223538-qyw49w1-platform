export default function AvatarCluster({ emojis = [], size = 'md', max = 6 }) {
  const shown = emojis.slice(0, max);
  const extra = emojis.length - shown.length;
  const sizeClasses = size === 'sm' ? 'h-7 w-7 text-base' : size === 'lg' ? 'h-12 w-12 text-2xl' : 'h-9 w-9 text-lg';
  return (
    <div className="flex -space-x-2 items-center">
      {shown.map((e, i) => (
        <div key={i} className={`${sizeClasses} rounded-full border border-white/10 bg-white/10 grid place-items-center`}>
          <span>{e}</span>
        </div>
      ))}
      {extra > 0 && (
        <div className={`${sizeClasses} rounded-full border border-white/10 bg-white/10 grid place-items-center text-xs`}>+{extra}</div>
      )}
    </div>
  );
}
