import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const variants: Record<string, string> = {
  default: 'bg-dark-500 text-dark-100',
  blue: 'bg-accent-blue/20 text-accent-blue',
  green: 'bg-accent-green/20 text-accent-green',
  orange: 'bg-accent-orange/20 text-accent-orange',
  red: 'bg-accent-red/20 text-accent-red',
  purple: 'bg-accent-purple/20 text-accent-purple',
};

export function Badge({ children, variant = 'default' }: Props) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant])}>
      {children}
    </span>
  );
}
