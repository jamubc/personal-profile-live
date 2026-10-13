import type { SymbolKind } from '../data/oss';

interface SchematicSymbolProps {
  kind: SymbolKind;
  size?: 32 | 40 | 96;
  className?: string;
}

/**
 * Four hairline symbols for the open-source schedule, drawn in one hand: a plug entering a socket
 * (MCP server), a terminal with a prompt (CLI), a sine wave on a framed grid (simulation) and an IC
 * outline with pins (application). Decorative: the component name sits beside the symbol.
 */
export function SchematicSymbol({ kind, size = 40, className }: SchematicSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ?? 'text-ink-2'}
    >
      {kind === 'mcp' && (
        <>
          {/* plug body, cable, two prongs */}
          <path d="M6 24h4" />
          <rect x="10" y="17" width="12" height="14" />
          <path d="M22 20.5h6M22 27.5h6" />
          {/* socket bracket */}
          <path d="M34 13h8v22h-8" />
          <path d="M30 20.5h4M30 27.5h4" />
        </>
      )}
      {kind === 'cli' && (
        <>
          <rect x="6" y="10" width="36" height="28" />
          <path d="M6 16h36" />
          <path d="M12 22l6 5-6 5" />
          <path d="M21 32h8" />
        </>
      )}
      {kind === 'sim' && (
        <>
          <rect x="6" y="10" width="36" height="28" />
          <path d="M18 10v28M30 10v28M6 24h36" strokeWidth="1" strokeOpacity="1" />
          <path d="M6 24c3-9 6-9 9 0s6 9 9 0 6-9 9 0 6 9 9 0" />
        </>
      )}
      {kind === 'app' && (
        <>
          <rect x="14" y="10" width="20" height="28" />
          <path d="M8 16h6M8 24h6M8 32h6M34 16h6M34 24h6M34 32h6" />
          <path d="M22 10a2 2 0 0 0 4 0" />
        </>
      )}
    </svg>
  );
}
