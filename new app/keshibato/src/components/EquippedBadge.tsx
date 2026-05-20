interface Props {
  index?: number;
}

export function EquippedBadge({ index }: Props) {
  return (
    <div
      className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-accent text-boardEdge shadow-glow"
      title="装着中"
    >
      装着中{typeof index === 'number' ? ` ${index + 1}` : ''}
    </div>
  );
}
