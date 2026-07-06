export const colors = {
  forest: "#1B4332",
  canopy: "#2D6A4F",
  leaf: "#40916C",
  moss: "#52B788",
  mist: "#B7E4C7",
  bark: "#6B4226",
  soil: "#3D1F0D",
  sky: "#CAF0F8",
  sand: "#F4F1DE",
  white: "#FAFAFA",
  offwhite: "#F0F4F0",
  dark: "#0D1B13",
  gray: "#6B7B6E",
  lightgray: "#D8E8DC",
  accent: "#F4A261",
  danger: "#E63946",
  gold: "#E9C46A"
} as const;

export type ColorName = keyof typeof colors;
