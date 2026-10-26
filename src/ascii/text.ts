/** Presentation conversion only. Original data and exports remain byte-for-byte intact. */
export function ascii(text: string): string {
  const replacements: Record<string, string> = {
    "–": "-",
    "—": "--",
    "→": "->",
    "←": "<-",
    "≈": "~",
    "≥": ">=",
    "≤": "<=",
    "≠": "!=",
    "×": "x",
    "·": ".",
    "’": "'",
    "‘": "'",
    "“": '"',
    "”": '"',
    "…": "...",
  };
  return text.replace(
    /[^\x00-\x7f]/g,
    (c) =>
      replacements[c] ?? `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}
