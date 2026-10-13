interface RegistrationMarkProps {
  size?: number;
  className?: string;
}

/**
 * The set's registration mark: a circle with a centerline cross (dash-dot, the drafting centerline).
 * Logo in the index column and the title block, and the favicon (public/favicon.svg is the same drawing).
 * Decorative wherever it appears: the text beside it carries the name.
 */
export function RegistrationMark({ size = 24, className }: RegistrationMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="butt"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 1v22M1 12h22" strokeDasharray="8 3 2 3" strokeDashoffset="7" />
    </svg>
  );
}
