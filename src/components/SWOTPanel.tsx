import { SWOTAnalysis } from "../types";
import { ShieldCheck, ShieldAlert, Sparkles, AlertTriangle, Lightbulb } from "lucide-react";

interface SWOTPanelProps {
  swot: SWOTAnalysis;
}

export default function SWOTPanel({ swot }: SWOTPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="text-indigo-400" size={20} />
            SWOT Analysis Matrix
          </h2>
          <p className="text-xs text-slate-400">
            A strategic evaluation mechanism mapping Internal (Strengths/Weaknesses) vs. External (Opportunities/Threats) business factors.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg text-slate-400 text-xs font-mono">
          <Lightbulb size={12} className="text-yellow-400 animate-pulse" />
          <span>Tip: Exploit Strengths to neutralize Threats!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STRENGTHS - Internal Helpful */}
        <div className="glow-card p-5 rounded-xl border border-emerald-500/10 bg-slate-950/40">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-500/25 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-300 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Strengths (S)
            </h3>
            <span className="text-[10px] font-mono font-semibold tracking-wider text-emerald-400/90 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20">
              INTERNAL / HELPFUL
            </span>
          </div>
          <ul className="space-y-3">
            {swot.strengths.map((item, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-slate-200">
                <span className="font-mono text-[10px] text-emerald-400 align-text-top mt-0.5 bg-emerald-950/50 p-1 w-5 h-5 flex items-center justify-center rounded border border-emerald-500/10">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES - Internal Harmful */}
        <div className="glow-card p-5 rounded-xl border border-rose-500/10 bg-slate-950/40">
          <div className="flex items-center justify-between mb-4 border-b border-rose-500/25 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-rose-300 flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-400" />
              Weaknesses (W)
            </h3>
            <span className="text-[10px] font-mono font-semibold tracking-wider text-rose-400/90 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-500/20">
              INTERNAL / HARMFUL
            </span>
          </div>
          <ul className="space-y-3">
            {swot.weaknesses.map((item, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-slate-200">
                <span className="font-mono text-[10px] text-rose-400 align-text-top mt-0.5 bg-rose-950/50 p-1 w-5 h-5 flex items-center justify-center rounded border border-rose-500/10">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OPPORTUNITIES - External Helpful */}
        <div className="glow-card p-5 rounded-xl border border-cyan-500/10 bg-slate-950/40">
          <div className="flex items-center justify-between mb-4 border-b border-cyan-500/25 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-300 flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400" />
              Opportunities (O)
            </h3>
            <span className="text-[10px] font-mono font-semibold tracking-wider text-cyan-400/90 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">
              EXTERNAL / HELPFUL
            </span>
          </div>
          <ul className="space-y-3">
            {swot.opportunities.map((item, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-slate-200">
                <span className="font-mono text-[10px] text-cyan-400 align-text-top mt-0.5 bg-cyan-950/50 p-1 w-5 h-5 flex items-center justify-center rounded border border-cyan-500/10">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* THREATS - External Harmful */}
        <div className="glow-card p-5 rounded-xl border border-amber-500/10 bg-slate-950/40">
          <div className="flex items-center justify-between mb-4 border-b border-amber-500/25 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-amber-300 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              Threats (T)
            </h3>
            <span className="text-[10px] font-mono font-semibold tracking-wider text-amber-400/90 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/20">
              EXTERNAL / HARMFUL
            </span>
          </div>
          <ul className="space-y-3">
            {swot.threats.map((item, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-slate-200">
                <span className="font-mono text-[10px] text-amber-400 align-text-top mt-0.5 bg-amber-950/50 p-1 w-5 h-5 flex items-center justify-center rounded border border-amber-500/10">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
