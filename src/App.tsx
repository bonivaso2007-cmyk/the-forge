import { useState, useEffect } from "react";
import { FounderContext, StartupModel, MindMapNode } from "./types";
import LeanBlueprint from "./components/LeanBlueprint";
import SWOTPanel from "./components/SWOTPanel";
import RoadmapView from "./components/RoadmapView";
import MindMap from "./components/MindMap";
import AdvisorPanel from "./components/AdvisorPanel";
import {
  Sparkles,
  Rocket,
  Layers,
  ShieldCheck,
  ListChecks,
  Activity,
  Bot,
  Grid,
  FileText,
  HelpCircle,
  Wand2,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight,
  Plus
} from "lucide-react";

export default function App() {
  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<"dashboard" | "blueprint" | "swot" | "mindmap" | "roadmap" | "advisor">("dashboard");
  
  // Model & Context input structures
  const [context, setContext] = useState<FounderContext>({
    idea: "",
    companyName: "",
    customer: "",
    problem: "",
    solution: "",
    market: "",
    revenueModel: ""
  });

  const [model, setModel] = useState<StartupModel | null>(null);
  
  // Loader and Error states
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [selectedMMNode, setSelectedMMNode] = useState<MindMapNode | null>(null);

  // Time metrics inside the header
  const [utcTime, setUtcTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      setUtcTime(new Date().toUTCString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick action: Autofill / completing context based on minimal core idea
  const handleAutofillContext = async () => {
    if (!context.idea.trim()) {
      setErrorText("Please state your brief startup idea first. E.g. 'Stripe for drone delivery services'");
      return;
    }

    setErrorText(null);
    setAutofillLoading(true);

    try {
      const response = await fetch("/api/generate-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: context.idea })
      });

      if (!response.ok) {
        const errResult = await response.json();
        throw new Error(errResult.error || "Autofill service errored");
      }

      const completedContext = await response.json();
      setContext(completedContext);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Failed to generate context. Please make sure the server builds and runs.");
    } finally {
      setAutofillLoading(false);
    }
  };

  // Full generate simulation model (SWOT, Canvas, SVG nodes list, Milestone timelines)
  const handleGenerateStartupWorkspace = async () => {
    // Basic verification
    if (!context.companyName || !context.customer || !context.problem || !context.solution) {
      setErrorText("Founder Details Check: Complete the profile or use AI Autofill to fill in missing details before launching!");
      return;
    }

    setErrorText(null);
    setGenerateLoading(true);

    try {
      const response = await fetch("/api/generate-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context })
      });

      if (!response.ok) {
        const errResult = await response.json();
        throw new Error(errResult.error || "Model generation failed");
      }

      const generatedModel = await response.json();
      setModel(generatedModel);
      
      // Auto-focus the core node in mindmap details initially
      const coreNode = generatedModel.mindmap.nodes.find((n: any) => n.type === "core");
      if (coreNode) {
        setSelectedMMNode(coreNode);
      }
      setActiveTab("dashboard");
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Failed to model startup. Make sure GEMINI_API_KEY is configured.");
    } finally {
      setGenerateLoading(false);
    }
  };

  // Clear startup state and allow modeling a fresh idea
  const handleResetModel = () => {
    if (confirm("Reset current model workspace? This will clear all calculated strategy assets and allow starting fresh.")) {
      setModel(null);
      setContext({
        idea: "",
        companyName: "",
        customer: "",
        problem: "",
        solution: "",
        market: "",
        revenueModel: ""
      });
      setErrorText(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-slate-100 flex flex-col font-sans transition-all duration-300">
      
      {/* 1. Global Platform Header and Navigation Brand */}
      <header className="border-b border-slate-850 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-white tracking-widest shadow-md shadow-indigo-950 glow-pulse">
            F
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white uppercase">FORGE</span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-500/15 font-mono px-1.5 py-0.5 rounded leading-none">STARTUP FOUNDRY</span>
            </div>
            <p className="text-xs text-slate-400">Tactical incubation framework and strategy workspace</p>
          </div>
        </div>

        {/* Global Metadata Clock Display and Controls */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-400 select-none">
            <Clock size={11} className="text-slate-500" />
            <span>UTC TIME: {utcTime}</span>
          </div>

          {model && (
            <button
              onClick={handleResetModel}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-white border border-rose-500/20 rounded-lg hover:bg-rose-900/30 transition-all cursor-pointer"
            >
              Reset Model Workspace
            </button>
          )}
        </div>
      </header>

      {/* 2. Platform Main Workspace Content */}
      <main className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col">
        {errorText && (
          <div className="mb-6 p-4 bg-rose-950/30 border border-rose-500/20 rounded-xl flex items-start gap-3">
            <HelpCircle className="text-rose-400 flex-shrink-0 mt-0.5" size={18} />
            <div className="flex-grow">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono">WORKSPACE ERROR LOG:</span>
              <p className="text-sm text-slate-300 mt-0.5 leading-relaxed">{errorText}</p>
            </div>
            <button
              onClick={() => setErrorText(null)}
              className="text-slate-500 hover:text-slate-300 text-xs font-mono px-2 py-1 rounded border border-slate-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {!model ? (
          /* ========================================================================= */
          /* ONBOARDING & SETUP VIEWS                                                 */
          /* ========================================================================= */
          <div className="flex-grow flex items-center justify-center py-5 sm:py-10">
            <div className="w-full max-w-3xl space-y-8">
              
              {/* Onboarding Intro Banner */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-indigo-950/50 border border-indigo-500/15 px-3.5 py-1 rounded-full text-indigo-300 text-xs font-mono tracking-widest uppercase">
                  <Sparkles size={12} className="animate-pulse" />
                  Model hypothetical ideas securely with Server-Side Gemini
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tight leading-none bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
                  Build the Future.
                </h1>
                <p className="text-slate-400 text-sm md:text-base max-w-xl mx-autoLeading-relaxed font-normal">
                  Provide your initial idea. Use our integrated AI helper to auto-complete missing profile context, then trigger the startup foundry workspace modeling engine.
                </p>
              </div>

              {/* Central setup form card */}
              <div className="glow-card rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                
                {/* 1. Raw startup idea (Autofill trigger) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>1. Describe the core idea:</span>
                    <span className="text-[10px] font-mono text-indigo-400">MINIMAL REQUIREMENT</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={context.idea}
                      onChange={(e) => setContext({ ...context, idea: e.target.value })}
                      placeholder="e.g. A premium locally sourced dark chocolate subscription box with virtual tasting sessions"
                      className="flex-grow bg-slate-900/90 border border-slate-800 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-100 placeholder:text-slate-600 font-normal transition-colors"
                    />
                    
                    <button
                      type="button"
                      onClick={handleAutofillContext}
                      disabled={autofillLoading || !context.idea.trim() || generateLoading}
                      className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-950"
                    >
                      {autofillLoading ? (
                        <RefreshCw className="animate-spin" size={14} />
                      ) : (
                        <Wand2 size={14} />
                      )}
                      <span>AI Auto-Complete Profile</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Type a simple concept and click autofill to complete target segments, value structures, problems, solutions, and monetization channels instantly with AI.
                  </p>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-850"></div>
                  <span className="flex-shrink-0 mx-4 text-[10px] font-mono text-slate-600 uppercase">Interactive profile controls</span>
                  <div className="flex-grow border-t border-slate-850"></div>
                </div>

                {/* 2. Structured details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Name:</label>
                    <input
                      type="text"
                      value={context.companyName}
                      onChange={(e) => setContext({ ...context, companyName: e.target.value })}
                      placeholder="e.g. ChocoVeritas"
                      className="w-full bg-slate-900/50 border border-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-400 text-slate-200 placeholder:text-slate-600 transition-colors"
                    />
                  </div>

                  {/* Target customer segment */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target customer segment:</label>
                    <input
                      type="text"
                      value={context.customer}
                      onChange={(e) => setContext({ ...context, customer: e.target.value })}
                      placeholder="e.g. Specialty coffee/wine lovers, urban foodies, virtual gift buyers"
                      className="w-full bg-slate-900/50 border border-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-400 text-slate-200 placeholder:text-slate-600 transition-colors"
                    />
                  </div>

                  {/* Problem being solved */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Core customer problem solved:</label>
                    <input
                      type="text"
                      value={context.problem}
                      onChange={(e) => setContext({ ...context, problem: e.target.value })}
                      placeholder="e.g. Gourmet chocolate gifts feel generic, mass market options lack trace-origin transparency or luxury flavor depth"
                      className="w-full bg-slate-900/50 border border-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-400 text-slate-200 placeholder:text-slate-600 transition-colors"
                    />
                  </div>

                  {/* Core product solution */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Prime solution UVP:</label>
                    <input
                      type="text"
                      value={context.solution}
                      onChange={(e) => setContext({ ...context, solution: e.target.value })}
                      placeholder="e.g. Single-origin bean-to-bar curated monthly subscription box paired with immersive video tasting masterclasses led by chocolatiers"
                      className="w-full bg-slate-900/50 border border-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-400 text-slate-200 placeholder:text-slate-600 transition-colors"
                    />
                  </div>

                  {/* Market opportunity context */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Market Context & TAM:</label>
                    <input
                      type="text"
                      value={context.market}
                      onChange={(e) => setContext({ ...context, market: e.target.value })}
                      placeholder="e.g. Premium gift market, niche craft chocolate sector ($6B TAM with CAGR of 8.5%)"
                      className="w-full bg-slate-900/50 border border-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-400 text-slate-200 placeholder:text-slate-600 transition-colors"
                    />
                  </div>

                  {/* Monetization revenue structure */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Monetization structure:</label>
                    <input
                      type="text"
                      value={context.revenueModel}
                      onChange={(e) => setContext({ ...context, revenueModel: e.target.value })}
                      placeholder="e.g. Curated product subscription, corporate gift bookings, seasonal hampers"
                      className="w-full bg-slate-900/50 border border-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-400 text-slate-200 placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Main Submit Action Trigger */}
                <div className="pt-4 border-t border-slate-855 flex justify-end">
                  <button
                    type="button"
                    onClick={handleGenerateStartupWorkspace}
                    disabled={generateLoading || autofillLoading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-950 select-none transition-all disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {generateLoading ? (
                      <RefreshCw className="animate-spin" size={16} />
                    ) : (
                      <Rocket size={16} />
                    )}
                    <span>Forge Full Workspace Model</span>
                  </button>
                </div>
              </div>

              {/* Onboarding bottom advice line */}
              <div className="text-center">
                <p className="text-slate-600 text-xs font-mono">
                  Your credentials and API Keys are safely evaluated exclusively on the server side.
                </p>
              </div>

            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* STAGE WORKSPACE AND VISUAL ANALYTICS DASHBOARD                            */
          /* ========================================================================= */
          <div className="flex-grow flex flex-col gap-6 animate-fadeIn">
            
            {/* Workshop metadata header line */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-950/80 p-5 rounded-xl border border-slate-850">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 bg-indigo-950/30 px-2.5 py-1 rounded border border-indigo-500/10">
                    ACTIVE VENTURE WORKSPACE
                  </span>
                  {model.isLocalFallback && (
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 bg-amber-950/30 px-2.5 py-1 rounded border border-amber-500/30 animate-pulse">
                      ⚠️ STANDALONE LOCAL SYNTHESIS ACTIVE (RATE-LIMIT SAFE)
                    </span>
                  )}
                  {model.isLiteModel && (
                    <span className="text-[10px] uppercase font-mono tracking-widest text-teal-400 bg-teal-950/30 px-2.5 py-1 rounded border border-teal-500/30">
                      ⚡ CASCADE LITE MODEL ACTIVE
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight">
                  {model.context.companyName}
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  <strong>FOUNDER HYPOTHESIS:</strong> {model.context.idea}
                </p>
              </div>

              {/* Top Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-lg text-center">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">STRATEGIC NODES</span>
                  <span className="text-base font-extrabold text-slate-100 font-mono">
                    {model.mindmap.nodes.length}
                  </span>
                </div>
                <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-lg text-center">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">ROADMAP GOALS</span>
                  <span className="text-base font-extrabold text-indigo-400 font-mono">
                    {model.roadmap.reduce((sum, m) => sum + m.actionItems.length, 0)}
                  </span>
                </div>
                <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-lg text-center col-span-2 sm:col-span-1">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">SECURITY COMPLIANCE</span>
                  <span className="text-[10px] font-bold text-emerald-400 font-mono flex items-center justify-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    SERVER SECURED
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard Workspace Tab Toggles Navigation Bar */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-850 pb-1 select-none">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`tab-btn flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "dashboard"
                    ? "text-indigo-400 border-indigo-500 shadow-sm"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                <Grid size={15} />
                Overview & Vision
              </button>

              <button
                onClick={() => setActiveTab("blueprint")}
                className={`tab-btn flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "blueprint"
                    ? "text-indigo-400 border-indigo-500 shadow-sm"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                <FileText size={15} />
                Lean Canvas (Blueprint)
              </button>

              <button
                onClick={() => setActiveTab("swot")}
                className={`tab-btn flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "swot"
                    ? "text-indigo-400 border-indigo-500 shadow-sm"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                <ShieldCheck size={15} />
                SWOT Matrix
              </button>

              <button
                onClick={() => setActiveTab("mindmap")}
                className={`tab-btn flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "mindmap"
                    ? "text-indigo-400 border-indigo-500 shadow-sm"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                <Activity size={15} />
                Interactive MindMap
              </button>

              <button
                onClick={() => setActiveTab("roadmap")}
                className={`tab-btn flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "roadmap"
                    ? "text-indigo-400 border-indigo-500 shadow-sm"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                <ListChecks size={15} />
                Execution Roadmap
              </button>

              <button
                onClick={() => setActiveTab("advisor")}
                className={`tab-btn flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "advisor"
                    ? "text-indigo-400 border-indigo-500 shadow-sm"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                <Bot size={15} />
                Forge AI Advisor (Chat)
              </button>
            </div>

            {/* Active Tab render workspace content */}
            <div className="flex-grow">
              
              {/* TAB 1: Dashboard & Brand Vision Overview */}
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Vision Board */}
                  <div className="lg:col-span-12 glow-card p-6 md:p-8 rounded-2xl flex flex-col justify-between gap-6 bg-gradient-to-br from-indigo-950/10 via-slate-950/70 to-slate-950">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles size={20} className="text-indigo-400" />
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-300">
                          COGNITIVE VISION HYPOTHESIS
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
                        "{model.visionStatement}"
                      </h2>
                    </div>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-850"></div>
                      <span className="flex-shrink-0 mx-4 text-[10px] font-mono text-slate-500 uppercase">Core strategy specs</span>
                      <div className="flex-grow border-t border-slate-850"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-1.5">
                        <span className="font-mono text-[10px] text-slate-500 uppercase block">TARGET CUSTOMER</span>
                        <p className="text-slate-300 leading-relaxed font-normal">{model.context.customer}</p>
                      </div>
                      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-1.5">
                        <span className="font-mono text-[10px] text-slate-500 uppercase block">PROBLEM POINT ADDRESS</span>
                        <p className="text-slate-300 leading-relaxed font-normal">{model.context.problem}</p>
                      </div>
                      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-1.5">
                        <span className="font-mono text-[10px] text-slate-500 uppercase block">DISTINCTIVE VALUE PROPOSITION</span>
                        <p className="text-slate-300 leading-relaxed font-normal">{model.context.solution}</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlight Panels */}
                  <div className="lg:col-span-8 glow-card p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
                        Venture Overview Specifications
                      </h3>
                      <button
                        onClick={() => setActiveTab("blueprint")}
                        className="text-indigo-400 hover:text-indigo-300 text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        Open canvas
                        <ChevronRight size={13} />
                      </button>
                    </div>

                    <div className="space-y-3 font-normal text-sm leading-relaxed text-slate-300">
                      <p>
                        Forge completed tactical calculations for **{model.context.companyName}**. The product strategy combines target customer segmentation validation with an adaptive, milestone-driven execution layout.
                      </p>
                      <p>
                        To explore the calculated models, select any strategy category from the layout navigation menu above. You can also consult with **Forge Advisor** in real-time, who is fully briefed on your vision statement and core problem specs.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-1.5">
                        <span className="font-mono text-[9px] text-indigo-400 uppercase tracking-wider block">TARGET MARKET SIZE</span>
                        <p className="text-slate-300 text-xs leading-relaxed font-normal">{model.context.market}</p>
                      </div>
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-1.5">
                        <span className="font-mono text-[9px] text-indigo-400 uppercase tracking-wider block">MONETIZATION PIPELINE</span>
                        <p className="text-slate-300 text-xs leading-relaxed font-normal">{model.context.revenueModel}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Help Card: Incubation Companion */}
                  <div className="lg:col-span-4 glow-card p-6 rounded-2xl flex flex-col justify-between bg-indigo-950/10 border-indigo-500/10 gap-5">
                    <div className="space-y-3">
                      <Bot className="text-indigo-400 w-8 h-8" />
                      <h3 className="text-sm font-bold text-slate-100">
                        Ask tactical guidance
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal">
                        Your incube advisor is ready to outline Go-To-Market pilots, evaluate competitor moats, and simulate pricing tiers.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("advisor")}
                      className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Consult Advisor Now
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Lean Strategy Canvas */}
              {activeTab === "blueprint" && (
                <LeanBlueprint blueprint={model.blueprint} />
              )}

              {/* TAB 3: SWOT Grid */}
              {activeTab === "swot" && (
                <SWOTPanel swot={model.swot} />
              )}

              {/* TAB 4: Visual MindMap SVG Workspace */}
              {activeTab === "mindmap" && (
                <MindMap
                  data={model.mindmap}
                  onSelectNode={(node) => setSelectedMMNode(node)}
                  selectedNode={selectedMMNode}
                />
              )}

              {/* TAB 5: Execution Milestone Timeline Checklist */}
              {activeTab === "roadmap" && (
                <RoadmapView roadmap={model.roadmap} companyName={model.context.companyName} />
              )}

              {/* TAB 6: Strategic Advisor Panel */}
              {activeTab === "advisor" && (
                <AdvisorPanel context={model.context} visionStatement={model.visionStatement} />
              )}

            </div>
          </div>
        )}
      </main>

      {/* 3. Global Footer copyright lines */}
      <footer className="border-t border-slate-900 bg-[#050506]/95 py-6 px-4 md:px-8 text-center text-[11px] text-slate-600 font-mono mt-10 space-y-1 select-none">
        <div>FORGE STARTUP FOUNDRY WORKSPACE • SECURED ENVIRONMENT SERVICES</div>
        <div>All models processed server-side utilizing the Google Gemini 3.5 Flash API securely.</div>
      </footer>

    </div>
  );
}
