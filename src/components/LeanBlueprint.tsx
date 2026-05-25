import { useState } from "react";
import { LeanBlueprint as LeanBlueprintType } from "../types";
import { AlertCircle, Rocket, HelpCircle, Target, Compass, Sparkles, TrendingUp, BarChart, DollarSign, Wallet } from "lucide-react";

interface LeanBlueprintProps {
  blueprint: LeanBlueprintType;
}

export default function LeanBlueprint({ blueprint }: LeanBlueprintProps) {
  const [activeCell, setActiveCell] = useState<string | null>(null);

  // High quality helper descriptions for Lean Canvas blocks
  const getCellHelp = (key: string) => {
    switch (key) {
      case "problem":
        return "The top problems your target customers face, and how they solve them today (Existing Alternatives).";
      case "solution":
        return "The most straightforward solution features that resolve each of your customer's defined pressure points.";
      case "keyMetrics":
        return "The key performance indicators (KPIs) or activities you measure to track progression and product traction.";
      case "uniqueValueProp":
        return "A single, clear, compelling message that states why your solution is different, valuable, and worth paying attention to.";
      case "unfairAdvantage":
        return "Something that cannot be easily copied, bought, or replicated by competitors (such as proprietary algorithms, IP, or network effects).";
      case "channels":
        return "The specific paths (marketing campaigns, direct sales, content channels) you use to reach your customer segments.";
      case "customerSegments":
        return "Your primary target audience, defined clearly, plus the specific profile attributes of early adopters who want it first.";
      case "costStructure":
        return "Your major fixed and variable costs (customer acquisition cost, server infrastructure, people, operational tool suites).";
      case "revenueStreams":
        return "Your monetization strategy, pricing model, customer lifetime value targets, and transactional streams.";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Rocket className="text-indigo-400" size={20} />
            Lean Strategy Blueprint
          </h2>
          <p className="text-xs text-slate-400">
            A 1-page business canvas mapping key strategic hypotheses based on Ash Maurya's Lean Startup framework.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          CLICK CARDS FOR DETAILED ADVICE & HYPOTHESIS HELP
        </div>
      </div>

      {activeCell && (
        <div className="p-4 bg-indigo-950/40 border border-indigo-500/20 rounded-xl flex items-start gap-3 animate-fadeIn">
          <HelpCircle className="text-indigo-400 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest font-mono">
              Hypothesis Help • {activeCell}
            </span>
            <p className="text-sm text-slate-300 mt-1">
              {getCellHelp(activeCell)}
            </p>
          </div>
        </div>
      )}

      {/* Lean Canvas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        
        {/* Row 1: Problem */}
        <div
          onClick={() => setActiveCell(activeCell === "problem" ? null : "problem")}
          className={`glow-card md:col-span-1 min-h-[220px] p-4 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-all ${
            activeCell === "problem" ? "glow-selected" : ""
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-3 border-b border-slate-800/60 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
              <AlertCircle size={14} className="text-red-400" />
              1. Problem
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950/80 px-1 py-0.5 rounded">HYPOTHESIS</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {blueprint.problem}
          </p>
          <div className="text-[10px] font-mono text-indigo-400/80 uppercase tracking-wider mt-4">
            Existing Alternatives
          </div>
          <div className="text-xs text-slate-400 italic mt-1 font-normal leading-relaxed">
            Unoptimized workflows, manual sheets, and expensive enterprise status quo.
          </div>
        </div>

        {/* Row 1 Col 2: Solution & Key Metrics */}
        <div className="md:col-span-1 flex flex-col gap-3">
          {/* Solution */}
          <div
            onClick={() => setActiveCell(activeCell === "solution" ? null : "solution")}
            className={`glow-card flex-1 p-4 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-all ${
              activeCell === "solution" ? "glow-selected" : ""
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800/60 pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Compass size={14} className="text-emerald-400" />
                4. Solution
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {blueprint.solution}
            </p>
          </div>
          
          {/* Key Metrics */}
          <div
            onClick={() => setActiveCell(activeCell === "keyMetrics" ? null : "keyMetrics")}
            className={`glow-card flex-1 p-4 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-all ${
              activeCell === "keyMetrics" ? "glow-selected" : ""
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800/60 pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                <BarChart size={14} className="text-amber-400" />
                8. Key Metrics
              </h3>
            </div>
            <ul className="space-y-1 text-xs text-slate-300">
              {blueprint.keyMetrics.map((metric, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 1 Col 3: Unique Value Proposition */}
        <div
          onClick={() => setActiveCell(activeCell === "uniqueValueProp" ? null : "uniqueValueProp")}
          className={`glow-card md:col-span-1 min-h-[220px] p-4 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-all ${
            activeCell === "uniqueValueProp" ? "glow-selected" : ""
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-3 border-b border-slate-800/60 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-400" />
              3. Unique Value
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950/80 px-1 py-0.5 rounded">CORE VISION</span>
          </div>
          <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed bg-indigo-950/30 p-2.5 rounded border border-indigo-500/10">
            {blueprint.uniqueValueProp}
          </p>
          <div className="text-[10px] font-mono text-indigo-400/80 uppercase tracking-wider mt-4">
            High-Level Concept
          </div>
          <div className="text-xs text-slate-400 italic mt-1 leading-relaxed">
            The simplest analogy to describe your business setup (e.g. Stripe for AI developers).
          </div>
        </div>

        {/* Row 1 Col 4: Unfair Advantage & Channels */}
        <div className="md:col-span-1 flex flex-col gap-3">
          {/* Unfair Advantage */}
          <div
            onClick={() => setActiveCell(activeCell === "unfairAdvantage" ? null : "unfairAdvantage")}
            className={`glow-card flex-1 p-4 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-all ${
              activeCell === "unfairAdvantage" ? "glow-selected" : ""
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800/60 pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                <TrendingUp size={14} className="text-pink-400" />
                9. Unfair Moat
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {blueprint.unfairAdvantage}
            </p>
          </div>
          
          {/* Channels */}
          <div
            onClick={() => setActiveCell(activeCell === "channels" ? null : "channels")}
            className={`glow-card flex-1 p-4 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-all ${
              activeCell === "channels" ? "glow-selected" : ""
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800/60 pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Compass size={14} className="text-cyan-400" />
                5. Channels
              </h3>
            </div>
            <ul className="space-y-1 text-xs text-slate-300">
              {blueprint.channels.map((chan, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{chan}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 1 Col 5: Customer Segments */}
        <div
          onClick={() => setActiveCell(activeCell === "customerSegments" ? null : "customerSegments")}
          className={`glow-card md:col-span-1 min-h-[220px] p-4 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-all ${
            activeCell === "customerSegments" ? "glow-selected" : ""
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-3 border-b border-slate-800/60 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Target size={14} className="text-violet-400" />
              2. Customers
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950/80 px-1 py-0.5 rounded">NICHE</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-200">
            {blueprint.customerSegments.map((seg, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="text-violet-400 font-bold">•</span>
                <span>{seg}</span>
              </li>
            ))}
          </ul>
          <div className="text-[10px] font-mono text-violet-400/80 uppercase tracking-wider mt-4">
            Early Adopters
          </div>
          <div className="text-xs text-slate-400 italic mt-1 leading-relaxed">
            Tech-forward managers and progressive startups looking to deploy instantly.
          </div>
        </div>
      </div>

      {/* Row 2: Cost Structure & Revenue Streams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Cost Structure */}
        <div
          onClick={() => setActiveCell(activeCell === "costStructure" ? null : "costStructure")}
          className={`glow-card p-4 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-all ${
            activeCell === "costStructure" ? "glow-selected" : ""
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-3 border-b border-slate-800/60 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Wallet size={14} className="text-rose-400" />
              7. Cost Structure
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950/80 px-1.5 py-0.5 rounded">OUTFLOWS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            {blueprint.costStructure.map((cost, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded border border-slate-800/40">
                <span className="font-mono text-[9px] text-rose-400/80 border border-rose-500/20 px-1 rounded bg-rose-950/10">0{idx + 1}</span>
                <span>{cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Streams */}
        <div
          onClick={() => setActiveCell(activeCell === "revenueStreams" ? null : "revenueStreams")}
          className={`glow-card p-4 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-all ${
            activeCell === "revenueStreams" ? "glow-selected" : ""
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-3 border-b border-slate-800/60 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
              <DollarSign size={14} className="text-emerald-400" />
              6. Revenue Streams
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950/80 px-1.5 py-0.5 rounded">INFLOWS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            {blueprint.revenueStreams.map((rev, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded border border-slate-800/40">
                <span className="font-mono text-[9px] text-emerald-400/80 border border-emerald-500/20 px-1 rounded bg-emerald-950/10">0{idx + 1}</span>
                <span>{rev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
