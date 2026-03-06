import { useRef, useState, useEffect, useCallback } from "react";
import type { MarkupTool, MarkupColor, StrokeWeight, MarkupElement, MarkupPoint } from "./types";
import { COLOR_VALUES, STROKE_WIDTHS } from "./types";

interface MarkupCanvasProps {
  imageSrc: string;
  markups: MarkupElement[];
  activeTool: MarkupTool;
  activeColor: MarkupColor;
  strokeWeight: StrokeWeight;
  onAddMarkup: (markup: MarkupElement) => void;
  onRemoveMarkup: (id: string) => void;
}

const genId = () => Math.random().toString(36).slice(2, 10);

const MarkupCanvas = ({
  imageSrc, markups, activeTool, activeColor, strokeWeight,
  onAddMarkup, onRemoveMarkup,
}: MarkupCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<MarkupPoint[]>([]);
  const [textInput, setTextInput] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [textValue, setTextValue] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0, offsetX: 0, offsetY: 0 });

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Calculate image fit dimensions
  const calcDimensions = useCallback(() => {
    if (!containerRef.current || !imgRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const img = imgRef.current;
    const scale = Math.min(container.width / img.width, container.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    setImgDimensions({
      w, h,
      offsetX: (container.width - w) / 2,
      offsetY: (container.height - h) / 2,
    });
  }, []);

  useEffect(() => {
    if (imgLoaded) calcDimensions();
    window.addEventListener("resize", calcDimensions);
    return () => window.removeEventListener("resize", calcDimensions);
  }, [imgLoaded, calcDimensions]);

  // Render canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    if (imgRef.current && imgDimensions.w > 0) {
      ctx.drawImage(imgRef.current, imgDimensions.offsetX, imgDimensions.offsetY, imgDimensions.w, imgDimensions.h);
    }

    // Draw saved markups
    const allMarkups = [...markups];
    // Draw current stroke
    if (drawing && currentPoints.length > 1) {
      allMarkups.push({
        id: "current",
        tool: activeTool as "circle" | "draw" | "arrow",
        color: activeColor,
        strokeWeight,
        points: currentPoints,
      });
    }

    for (const m of allMarkups) {
      ctx.strokeStyle = COLOR_VALUES[m.color];
      ctx.fillStyle = COLOR_VALUES[m.color];
      ctx.lineWidth = STROKE_WIDTHS[m.strokeWeight];
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (m.tool === "draw" || m.tool === "circle") {
        if (m.points.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(m.points[0].x, m.points[0].y);
        for (let i = 1; i < m.points.length; i++) {
          ctx.lineTo(m.points[i].x, m.points[i].y);
        }
        if (m.tool === "circle") ctx.closePath();
        ctx.stroke();
      } else if (m.tool === "arrow") {
        if (m.points.length < 2) continue;
        const start = m.points[0];
        const end = m.points[m.points.length - 1];
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        // Arrowhead
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLen = 12;
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      } else if (m.tool === "text" && m.text) {
        ctx.font = "600 14px 'DM Sans', sans-serif";
        const padding = 6;
        const metrics = ctx.measureText(m.text);
        const bgW = metrics.width + padding * 2;
        const bgH = 22;
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillRect(m.points[0].x - 2, m.points[0].y - bgH + 4, bgW, bgH);
        ctx.fillStyle = COLOR_VALUES[m.color];
        ctx.fillText(m.text, m.points[0].x + padding - 2, m.points[0].y);
      }
    }
  }, [markups, drawing, currentPoints, activeTool, activeColor, strokeWeight, imgDimensions]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const getCanvasPoint = (e: React.MouseEvent): MarkupPoint => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "pan") return;
    if (activeTool === "eraser") {
      // Find closest markup and remove
      const pt = getCanvasPoint(e);
      let closestId: string | null = null;
      let closestDist = 20;
      for (const m of markups) {
        for (const p of m.points) {
          const d = Math.hypot(p.x - pt.x, p.y - pt.y);
          if (d < closestDist) {
            closestDist = d;
            closestId = m.id;
          }
        }
      }
      if (closestId) onRemoveMarkup(closestId);
      return;
    }
    if (activeTool === "text") {
      const pt = getCanvasPoint(e);
      setTextInput({ x: pt.x, y: pt.y, visible: true });
      setTextValue("");
      return;
    }
    setDrawing(true);
    setCurrentPoints([getCanvasPoint(e)]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing) return;
    setCurrentPoints((prev) => [...prev, getCanvasPoint(e)]);
  };

  const handleMouseUp = () => {
    if (!drawing) return;
    setDrawing(false);
    if (currentPoints.length > 1) {
      onAddMarkup({
        id: genId(),
        tool: activeTool as "circle" | "draw" | "arrow",
        color: activeColor,
        strokeWeight,
        points: currentPoints,
      });
    }
    setCurrentPoints([]);
  };

  const handleTextConfirm = () => {
    if (textValue.trim()) {
      onAddMarkup({
        id: genId(),
        tool: "text",
        color: activeColor,
        strokeWeight,
        points: [{ x: textInput.x, y: textInput.y }],
        text: textValue.trim(),
      });
    }
    setTextInput({ x: 0, y: 0, visible: false });
    setTextValue("");
  };

  const cursor = activeTool === "pan" ? "grab" :
    activeTool === "eraser" ? "crosshair" :
    activeTool === "text" ? "text" : "crosshair";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={{ backgroundColor: "#F5F5F3" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      {textInput.visible && (
        <input
          autoFocus
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleTextConfirm(); if (e.key === "Escape") setTextInput({ x: 0, y: 0, visible: false }); }}
          onBlur={handleTextConfirm}
          className="absolute z-10 bg-background border border-border rounded px-2 py-1 text-sm font-sans shadow-md"
          style={{ left: textInput.x, top: textInput.y - 30, minWidth: 120 }}
          placeholder="Add label..."
        />
      )}
    </div>
  );
};

export default MarkupCanvas;
