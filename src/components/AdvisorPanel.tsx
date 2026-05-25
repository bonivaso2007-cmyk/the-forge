import { useState, useRef, useEffect } from "react";
import { FounderContext, AdvisorMessage } from "../types";
import { MessageSquare, Send, Sparkles, AlertCircle, Bot, User, Trash2 } from "lucide-react";

interface AdvisorPanelProps {
  context: FounderContext;
  visionStatement: string;
}

export default function AdvisorPanel({ context, visionStatement }: AdvisorPanelProps) {
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions tailored specifically to founders
  const suggestedPrompts = [
    "Critique my pricing & unit economics",
    "How do I hunt for my early adopters?",
    "Suggest 3 unfair advantages I could develop",
    "Identify critical threats in this niche"
  ];

  // Initialize conversations with a friendly intro from Forge Advisor
  useEffect(() => {
    const savedChat = localStorage.getItem(`forge-advisor-chat-${context.companyName}`);
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
        return;
      } catch (e) {
        console.error("Clean chat due to reload parse issue:", e);
      }
    }

    // Default welcoming message
    const intro: AdvisorMessage = {
      id: "intro",
      sender: "advisor",
      text: `Hello! I am your **Forge Advisor**, fueled by the latest incubator expertise. 

I've carefully analyzed your pitch and structure details for **${context.companyName}**. Together, we can harden your business modeling.

What direction would you like to stress-test or explore first? Feel free to write custom queries or click any suggested prompt below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages([intro]);
  }, [context]);

  // Save chat progression state
  const saveMessages = (allMsgs: AdvisorMessage[]) => {
    setMessages(allMsgs);
    try {
      localStorage.setItem(`forge-advisor-chat-${context.companyName}`, JSON.stringify(allMsgs));
    } catch (e) {
      console.error(e);
    }
  };

  // Scroll viewport down when messages mount
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Handle message submission
  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isSending) return;

    setErrorMsg(null);
    setInputText("");

    const userMessage: AdvisorMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const nextMessages = [...messages, userMessage];
    saveMessages(nextMessages);
    setIsSending(true);

    try {
      const response = await fetch("/api/advisor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          context,
          visionStatement
        })
      });

      if (!response.ok) {
        const errResult = await response.json();
        throw new Error(errResult.error || "Advisor service failed to reply");
      }

      const result = await response.json();
      const advisorMessage: AdvisorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "advisor",
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      saveMessages([...nextMessages, advisorMessage]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to contact Advisor. Make sure server is online.");
    } finally {
      setIsSending(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Reset advisor consultation history? This will clear all dialogue.")) {
      localStorage.removeItem(`forge-advisor-chat-${context.companyName}`);
      const intro: AdvisorMessage = {
        id: "intro-reset",
        sender: "advisor",
        text: `Consultation chat reset. Ready to stress-test **${context.companyName}** starting fresh!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([intro]);
    }
  };

  return (
    <div className="flex flex-col h-[560px] max-h-[85vh] bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-950/80 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/45 flex items-center justify-center text-indigo-400">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              Forge Advisor Agent
              <Sparkles size={12} className="text-indigo-400 animate-pulse" />
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              consultation line active
            </span>
          </div>
        </div>

        {/* Clear History Button */}
        {messages.length > 1 && (
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-500 hover:text-rose-400 border border-slate-800 rounded hover:bg-slate-950 transition-colors"
            title="Reset Chat history"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-slate-950/20">
        {messages.map((m) => {
          const isAdvisor = m.sender === "advisor";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3.5 max-w-[85%] ${
                isAdvisor ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Sender Avatar */}
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center text-xs flex-shrink-0 border mt-0.5 ${
                  isAdvisor
                    ? "bg-indigo-950/80 border-indigo-500/20 text-indigo-400"
                    : "bg-slate-800 border-slate-700 text-slate-300"
                }`}
              >
                {isAdvisor ? <Bot size={14} /> : <User size={14} />}
              </div>

              {/* Speech bubble */}
              <div className="flex flex-col gap-1">
                <div
                  className={`text-xs leading-relaxed px-4 py-3 rounded-2xl whitespace-pre-line ${
                    isAdvisor
                      ? "bg-slate-900/90 border border-slate-800/80 text-slate-200 rounded-tl-sm"
                      : "bg-indigo-600 text-white rounded-tr-sm"
                  }`}
                >
                  {/* Clean line render, preserving basic spacing */}
                  {m.text}
                </div>
                <span className="text-[9px] font-mono text-slate-500 px-1 self-end leading-none">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Dynamic Thinking state */}
        {isSending && (
          <div className="flex items-start gap-3.5 mr-auto max-w-[85%]">
            <div className="w-7 h-7 rounded-sm bg-indigo-950/80 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot size={14} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="bg-slate-900/40 border border-slate-850 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                </span>
                <span className="text-xs text-slate-400 font-mono">Advisor is formulating tactical answer...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg text-xs text-rose-300">
            <AlertCircle size={14} className="text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts footer wrapper */}
      <div className="px-5 py-2.5 border-t border-slate-800/60 bg-slate-950/20">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-mono text-slate-500 mr-1 uppercase">Slam-test:</span>
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              disabled={isSending}
              className="text-[10px] bg-slate-900 hover:bg-slate-850 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800 hover:border-indigo-500/20 transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-40"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(inputText);
        }}
        className="px-5 py-4 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-3"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Stress-test your customer acquisition or revenue stream setup...`}
          disabled={isSending}
          className="flex-grow bg-slate-900/85 border border-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-100 placeholder:text-slate-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none flex-shrink-0 shadow-md shadow-indigo-950"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
