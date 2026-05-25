import React, { useState, useRef, useEffect } from "react";
import { MindMapData, MindMapNode } from "../types";
import { ZoomIn, ZoomOut, RotateCcw, Info, Activity, Layers, Megaphone, Settings2, DollarSign } from "lucide-react";

interface MindMapProps {
  data: MindMapData;
  onSelectNode: (node: MindMapNode) => void;
  selectedNode: MindMapNode | null;
}

export default function MindMap({ data, onSelectNode, selectedNode }: MindMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to match node type with colors and icons
  const getNodeConfig = (type: string) => {
    switch (type) {
      case "core":
        return {
          bg: "#4338ca",
          border: "#6366f1",
          text: "#e0e7ff",
          icon: Layers,
          label: "Core Strategy"
        };
      case "product":
        return {
          bg: "#065f46",
          border: "#10b981",
          text: "#ecfdf5",
          icon: Activity,
          label: "Product & Engineering"
        };
      case "marketing":
        return {
          bg: "#9a3412",
          border: "#f97316",
          text: "#fff7ed",
          icon: Megaphone,
          label: "Growth & Channels"
        };
      case "operations":
        return {
          bg: "#1e3a8a",
          border: "#3b82f6",
          text: "#eff6ff",
          icon: Settings2,
          label: "Operations & Stack"
        };
      case "finance":
        return {
          bg: "#854d0e",
          border: "#eab308",
          text: "#fef9c3",
          icon: DollarSign,
          label: "Revenue & Finance"
        };
      default:
        return {
          bg: "#374151",
          border: "#9ca3af",
          text: "#f3f4f6",
          icon: Info,
          label: "General Node"
        };
    }
  };

  // Reset viewport zoom/pan
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag handlers for canvas panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "circle" || (e.target as HTMLElement).closest(".node-element")) {
      return; // click on node element shouldn't drag canvas
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Scroll wheel zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(prev * zoomFactor, 3));
    } else {
      setZoom((prev) => Math.max(prev / zoomFactor, 0.5));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-full min-h-[500px]">
      {/* Mindmap SVG Canvas Panel */}
      <div className="flex-1 bg-slate-950/40 relative border border-slate-800 rounded-xl overflow-hidden select-none">
        {/* Navigation / Interaction Guide Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400">
          <Info size={14} className="text-indigo-400" />
          <span>Drag canvas to scroll. Click nodes to inspect structure.</span>
        </div>

        {/* Viewport Action Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5">
          <button
            onClick={() => setZoom((z) => Math.min(z * 1.2, 3))}
            className="w-9 h-9 flex items-center justify-center bg-slate-900/95 text-slate-300 hover:text-white border border-slate-800 rounded-lg hover:bg-slate-800 transition-all shadow-md"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z / 1.2, 0.5))}
            className="w-9 h-9 flex items-center justify-center bg-slate-900/95 text-slate-300 hover:text-white border border-slate-800 rounded-lg hover:bg-slate-800 transition-all shadow-md"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={handleReset}
            className="w-9 h-9 flex items-center justify-center bg-slate-900/95 text-slate-300 hover:text-white border border-slate-800 rounded-lg hover:bg-slate-800 transition-all shadow-md"
            title="Recenter"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* SVG Container */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className={`w-full h-full min-h-[480px] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] cursor-grab ${
            isDragging ? "cursor-grabbing" : ""
          }`}
        >
          <svg className="w-full h-full min-h-[480px]">
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* SVG Marker arrows for linkage direction */}
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="33"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155" />
                </marker>
              </defs>

              {/* Linking Paths */}
              {data.links.map((link, idx) => {
                const sourceNode = data.nodes.find((n) => n.id === link.source);
                const targetNode = data.nodes.find((n) => n.id === link.target);

                if (!sourceNode || !targetNode) return null;

                // Draw curve link instead of raw straight line for refined aesthetic
                const dx = targetNode.x - sourceNode.x;
                const dy = targetNode.y - sourceNode.y;
                const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // Controls the curvature arc

                return (
                  <path
                    key={`link-${idx}`}
                    d={`M${sourceNode.x},${sourceNode.y} A${dr},${dr} 0 0,1 ${targetNode.x},${targetNode.y}`}
                    stroke="#1e293b"
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray={sourceNode.type === "core" ? "none" : "4 4"}
                    markerEnd="url(#arrow)"
                    className="transition-colors duration-300"
                  />
                );
              })}

              {/* Node Elements */}
              {data.nodes.map((node) => {
                const config = getNodeConfig(node.type);
                const isSelected = selectedNode?.id === node.id;
                const NodeIcon = config.icon;

                return (
                  <g
                    key={`node-${node.id}`}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => onSelectNode(node)}
                    className="node-element group cursor-pointer"
                  >
                    {/* Ripple Halo Background for Selected / Highlighted Node */}
                    <circle
                      r={node.type === "core" ? "42" : "32"}
                      fill="none"
                      stroke={isSelected ? "#818cf8" : config.border}
                      strokeWidth={isSelected ? "4" : "1"}
                      className={`opacity-20 ${
                        isSelected ? "animate-pulse" : "group-hover:opacity-40 transition-opacity"
                      }`}
                    />

                    {/* Main Node Circle */}
                    <circle
                      r={node.type === "core" ? "34" : "25"}
                      fill={config.bg}
                      stroke={isSelected ? "#818cf8" : config.border}
                      strokeWidth={isSelected ? "3" : "2"}
                      className="transition-all duration-300 shadow-lg"
                    />

                    {/* Node Icon inside circle */}
                    <g transform={node.type === "core" ? "translate(-10, -10)" : "translate(-8, -8)"}>
                      <NodeIcon
                        size={node.type === "core" ? 20 : 16}
                        className="text-white opacity-90"
                      />
                    </g>

                    {/* Node Text Label Frame */}
                    <foreignObject
                      x={node.type === "core" ? "-100" : "-85"}
                      y={node.type === "core" ? "45" : "35"}
                      width={node.type === "core" ? "200" : "170"}
                      height="60"
                      className="overflow-visible"
                    >
                      <div className="text-center flex flex-col items-center">
                        <span
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold leading-tight tracking-wide shadow-sm border ${
                            isSelected
                              ? "bg-slate-900 border-indigo-400 text-indigo-200"
                              : "bg-slate-900/95 border-slate-800 text-slate-200"
                          } group-hover:border-indigo-500/50 transition-colors`}
                        >
                          {node.label}
                        </span>
                        
                        <span className="text-[10px] text-slate-500 font-mono mt-1 opacity-80 uppercase tracking-widest bg-slate-950/40 px-1 py-0.5 rounded">
                          {config.label}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Selected Node Details Side Drawer */}
      <div className="w-full lg:w-80 bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        {selectedNode ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getNodeConfig(selectedNode.type).border }}
              />
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                {getNodeConfig(selectedNode.type).label}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-100 mb-2 leading-tight">
              {selectedNode.label}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-4 font-normal">
              {selectedNode.description}
            </p>

            <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 text-xs">
              <h4 className="font-semibold text-slate-400 uppercase tracking-wider font-mono">
                System Insights:
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Targeted connection path generated using the Forge Core module rules.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Key validation milestone for evaluating market scalability.</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-60">
            <Layers className="w-10 h-10 text-slate-500 mb-3 animate-pulse" />
            <h3 className="text-sm font-semibold text-slate-300 mb-1">No node selected</h3>
            <p className="text-xs text-slate-500 max-w-[200px]">
              Click on any structural branch node on the map to inspect key setup details.
            </p>
          </div>
        )}

        {/* Action button inside inspector */}
        {selectedNode && (
          <div className="pt-4 border-t border-slate-800/80 mt-5">
            <div className="text-[10px] font-mono text-slate-500">
              COORDINATES: X:{selectedNode.x} Y:{selectedNode.y}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
