import { useRef } from 'react';
import { useFieldRepulsion } from '../../hooks/useFieldRepulsion';

export const Avatar = ({ initials = 'A', className = '' }) => {
  const avatarRef = useRef(null);
  useFieldRepulsion(avatarRef);

  return (
    <div
      ref={avatarRef}
      className={`
        w-28 h-28 md:w-32 md:h-32
        bg-bg-card/60 backdrop-blur-xl
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

