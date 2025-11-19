export const Avatar = ({ initials = 'A', className = '' }) => {
  return (
    <div
      className={`
        w-28 h-28 md:w-32 md:h-32
        bg-bg-card
        border border-border-secondary
        rounded-full
        shadow-lg
        flex items-center justify-center
        text-h2 font-bold text-text-primary
        overflow-hidden
        ${className}
      `}
      aria-label="Avatar"
    >
      {initials}
    </div>
  );
};

