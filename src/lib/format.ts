/** Dates print as ISO (2025-11-17) everywhere on the sheets, the same form the title blocks use. */
export const formatDate = (iso: string): string => iso.slice(0, 10);
