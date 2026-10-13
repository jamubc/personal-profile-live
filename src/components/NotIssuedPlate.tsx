interface NotIssuedPlateProps {
  w: number;
  h: number;
  label?: string;
}

/**
 * The drafting convention for a blanked area: 45-degree hatching inside a hidden-line (dashed) frame.
 * Used for the HOLD sheets that have no figure yet. The text sits on a paper backing so the hatch
 * never crosses it; under 120 px wide the text is not drawn and the accessible name carries it.
 */
export function NotIssuedPlate({ w, h, label = 'Figure not issued' }: NotIssuedPlateProps) {
  const showText = w >= 120 && h >= 40;
  return (
    <span
      role="img"
      aria-label={label}
      className="hatch rule-hidden relative box-border inline-flex shrink-0 items-center justify-center overflow-hidden bg-paper"
      style={{ width: w, height: h }}
    >
      {showText && <span className="t-micro relative bg-paper px-1 text-center">{label}</span>}
    </span>
  );
}
