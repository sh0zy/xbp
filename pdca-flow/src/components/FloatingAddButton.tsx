interface FloatingAddButtonProps {
  onClick: () => void;
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-5 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-primary/30 z-50 active:scale-95 transition-transform"
    >
      +
    </button>
  );
}
