// Plain metadata for the 5 major aspects — kept separate from
// AstroIcons3D.tsx (which pulls in three.js/@react-three/fiber) so importing
// labels/symbols here doesn't force that heavier bundle to load eagerly.
export type MajorAspectType =
  | "conjunction"
  | "sextile"
  | "square"
  | "trine"
  | "opposition";

export const MAJOR_ASPECTS: MajorAspectType[] = [
  "conjunction",
  "sextile",
  "square",
  "trine",
  "opposition",
];

export const ASPECT_SYMBOL: Record<MajorAspectType, string> = {
  conjunction: "☌",
  sextile: "⚹",
  square: "□",
  trine: "△",
  opposition: "☍",
};

export const ASPECT_LABEL: Record<MajorAspectType, string> = {
  conjunction: "Conjunction",
  sextile: "Sextile",
  square: "Square",
  trine: "Trine",
  opposition: "Opposition",
};
