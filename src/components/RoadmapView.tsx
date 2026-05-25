import { useState, useEffect } from "react";
import { RoadmapMilestone } from "../types";
import { ListChecks, Calendar, CheckSquare, Square, TrendingUp, Info } from "lucide-react";

interface RoadmapViewProps {
  roadmap: RoadmapMilestone[];
  companyName: string;
}

export default function RoadmapView({ roadmap, companyName }: RoadmapViewProps) {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Initialize checklist state or load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`forge-roadmap-completed-${companyName}`);
      if (saved) {
        setCompletedItems(JSON.parse(saved));
      } else {
        // Default all to false
        const initial: Record<string, boolean> = {};
        roadmap.forEach((milestone, mIdx) => {
          milestone.actionItems.forEach((_, aIdx) => {
            initial[`${mIdx}-${aIdx}`] = false;
          });
        });
        setCompletedItems(initial);
      }
    } catch (e) {
      console.error(e);
    }
  }, [roadmap, companyName]);

  // Handle checking/unchecking action items
  const toggleItem = (mIdx: number, aIdx: number) => {
    const key = `${mIdx}-${aIdx}`;
    const next = {
      ...completedItems,
      [key]: !completedItems[key],
    };
    setCompletedItems(next);
    try {
      localStorage.setItem(`forge-roadmap-completed-${companyName}`, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  // Compute stats
  const totalItems = roadmap.reduce((sum, milestone) => sum + milestone.actionItems.length, 0);
  const checkedItems = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header and Progress Metrics */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ListChecks className="text-indigo-400" size={20} />
            Execution Roadmap
          </h2>
          <p className="text-xs text-slate-400">
            A step-by-step phased execution timeline designed to take your setup from validation to market pilot.
          </p>
        </div>

        {/* Progress display */}
        <div className="flex-1 md:max-w-xs flex flex-col justify-center gap-1.5 border-t md:border-t-0 md:border-l border-slate-850 pt-3 md:pt-0 md:pl-5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">ROADMAP PREPARATION PROGRESS:</span>
            <span className="text-indigo-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono text-right flex items-center justify-end gap-1 select-none">
            <TrendingUp size={10} />
            <span>{checkedItems} of {totalItems} tasks complete</span>
          </div>
        </div>
      </div>

      {/* Checklist Tip */}
      <div className="flex items-center gap-2 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 text-xs text-slate-400">
        <Info size={14} className="text-indigo-400" />
        <span>Your checked progression items are saved locally. Toggle goals off once tackled!</span>
      </div>

      {/* Phased Timeline */}
      <div className="relative border-l-2 border-slate-800 ml-3 md:ml-6 pl-5 md:pl-10 space-y-8 py-2">
        {roadmap.map((milestone, mIdx) => {
          // Calculate phase-specific progress
          const phaseTotal = milestone.actionItems.length;
          const phaseChecked = milestone.actionItems.reduce((sum, _, aIdx) => {
            return sum + (completedItems[`${mIdx}-${aIdx}`] ? 1 : 0);
          }, 0);
          const phaseDone = phaseChecked === phaseTotal;

          return (
            <div key={mIdx} className="relative group scroll-mt-24">
              {/* Timeline marker icon/badge */}
              <div
                className={`absolute -left-[31px] md:-left-[51px] top-0 w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all ${
                  phaseDone
                    ? "bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-900/40"
                    : "bg-slate-900 border-indigo-500 text-indigo-300"
                }`}
              >
                {mIdx + 1}
              </div>

              {/* Card wrapper */}
              <div className="glow-card p-5 rounded-xl space-y-4">
                {/* Phase Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/10">
                      {milestone.phase || `Phase ${mIdx + 1}`}
                    </span>
                    <h3 className="text-base font-bold text-slate-200 mt-1">
                      {milestone.title}
                    </h3>
                  </div>

                  {/* Timeline Badge */}
                  <div className="flex items-center gap-1.5 self-start sm:self-center text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/10 px-2.5 py-1 rounded-full font-mono">
                    <Calendar size={13} />
                    <span>{milestone.timeline}</span>
                  </div>
                </div>

                {/* Left/Right Grid inside phase card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Strategic Objectives */}
                  <div className="lg:col-span-5 space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      🎯 Core Objectives
                    </h4>
                    <ul className="space-y-2">
                      {milestone.objectives.map((obj, oIdx) => (
                        <li key={oIdx} className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded border border-slate-800/40 flex items-start gap-2">
                          <span className="text-indigo-400 font-bold font-mono">▸</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions checklist */}
                  <div className="lg:col-span-7 space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>🚀 Checklist Actions ({phaseChecked}/{phaseTotal})</span>
                      {phaseDone && <span className="text-[10px] text-emerald-400 capitalize bg-emerald-950/30 px-1.5 rounded border border-emerald-500/10">Phase Complete!</span>}
                    </h4>
                    
                    <div className="space-y-1.5">
                      {milestone.actionItems.map((action, aIdx) => {
                        const isChecked = !!completedItems[`${mIdx}-${aIdx}`];
                        return (
                          <div
                            key={aIdx}
                            onClick={() => toggleItem(mIdx, aIdx)}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-900/30 transition-all select-none ${
                              isChecked
                                ? "bg-slate-950/80 border-slate-850 opacity-70"
                                : "bg-slate-950/40 border-slate-800 hover:border-indigo-500/20"
                            }`}
                          >
                            <span className="flex-shrink-0 mt-0.5">
                              {isChecked ? (
                                <CheckSquare size={16} className="text-emerald-400" />
                              ) : (
                                <Square size={16} className="text-slate-500" />
                              )}
                            </span>
                            <span className={`text-xs leading-relaxed ${isChecked ? "line-through text-slate-500" : "text-slate-200"}`}>
                              {action}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
