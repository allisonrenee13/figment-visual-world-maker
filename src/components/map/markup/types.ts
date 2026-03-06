export type MarkupTool = "pan" | "circle" | "draw" | "arrow" | "text" | "eraser";
export type MarkupColor = "green" | "red" | "gold" | "black";
export type StrokeWeight = "thin" | "medium" | "thick";

export interface MarkupPoint {
  x: number;
  y: number;
}

export interface MarkupElement {
  id: string;
  tool: "circle" | "draw" | "arrow" | "text";
  color: MarkupColor;
  strokeWeight: StrokeWeight;
  points: MarkupPoint[];
  text?: string;
}

export interface MarkupImage {
  id: string;
  src: string;
  label: string;
  markups: MarkupElement[];
  notes: string;
  hasMarkup: boolean;
}

export const STROKE_WIDTHS: Record<StrokeWeight, number> = {
  thin: 2,
  medium: 4,
  thick: 7,
};

export const COLOR_VALUES: Record<MarkupColor, string> = {
  green: "#22c55e",
  red: "#ef4444",
  gold: "#C9A84C",
  black: "#1a1a1a",
};
