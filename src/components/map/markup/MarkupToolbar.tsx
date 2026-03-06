import { Hand, Circle, Pencil, MoveRight, Type, Eraser, Undo2, Redo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarkupTool, MarkupColor, StrokeWeight } from "./types";

interface MarkupToolbarProps {
  activeTool: MarkupTool;
  activeColor: MarkupColor;
  strokeWeight: StrokeWeight;
  onToolChange: (tool: MarkupTool) => void;
  onColorChange: (color: MarkupColor) => void;
  onStrokeChange: (weight: StrokeWeight) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const tools: { id: MarkupTool; icon: typeof Hand; label: string }[] = [
  { id: "pan", icon: Hand, label: "Pan" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "draw", icon: Pencil, label: "Draw" },
  { id: "arrow", icon: MoveRight, label: "Arrow" },
  { id: "text", icon: Type, label: "Text" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
];

const colors: { id: MarkupColor; hex: string; label: string }[] = [
  { id: "green", hex: "#22c55e", label: "Include" },
  { id: "red", hex: "#ef4444", label: "Exclude" },
  { id: "gold", hex: "#C9A84C", label: "Adapt" },
  { id: "black", hex: "#1a1a1a", label: "Neutral" },
];

const strokes: { id: StrokeWeight; width: number }[] = [
  { id: "thin", width: 1 },
  { id: "medium", width: 2 },
  { id: "thick", width: 3 },
];

const MarkupToolbar = ({
  activeTool, activeColor, strokeWeight,
  onToolChange, onColorChange, onStrokeChange,
  onUndo, onRedo, canUndo, canRedo,
}: MarkupToolbarProps) => {
  return (
    <div className="flex items-center gap-1 bg-background rounded-full shadow-lg border border-border px-3 py-2">
      {/* Tools */}
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
            activeTool === tool.id
              ? "bg-primary text-primary-foreground"
              : "text-foreground/70 hover:bg-muted"
          )}
          title={tool.label}
        >
          <tool.icon className="h-4 w-4" />
        </button>
      ))}

      <div className="w-px h-6 bg-border mx-1" />

      {/* Colors */}
      {colors.map((color) => (
        <button
          key={color.id}
          onClick={() => onColorChange(color.id)}
          className={cn(
            "w-6 h-6 rounded-full border-2 transition-all",
            activeColor === color.id ? "border-foreground scale-110" : "border-transparent"
          )}
          style={{ backgroundColor: color.hex }}
          title={color.label}
        />
      ))}

      <div className="w-px h-6 bg-border mx-1" />

      {/* Stroke weight */}
      {strokes.map((s) => (
        <button
          key={s.id}
          onClick={() => onStrokeChange(s.id)}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
            strokeWeight === s.id ? "bg-muted" : "hover:bg-muted/50"
          )}
          title={s.id}
        >
          <div
            className="rounded-full bg-foreground"
            style={{ width: 16, height: s.width * 2 }}
          />
        </button>
      ))}

      <div className="w-px h-6 bg-border mx-1" />

      {/* Undo/Redo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/70 hover:bg-muted disabled:opacity-30"
        title="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/70 hover:bg-muted disabled:opacity-30"
        title="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MarkupToolbar;
