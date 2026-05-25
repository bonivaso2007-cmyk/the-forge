export interface FounderContext {
  idea: string;
  companyName: string;
  customer: string;
  problem: string;
  solution: string;
  market: string;
  revenueModel: string;
}

export interface LeanBlueprint {
  problem: string;
  solution: string;
  keyMetrics: string[];
  uniqueValueProp: string;
  unfairAdvantage: string;
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface RoadmapMilestone {
  phase: string;
  title: string;
  timeline: string;
  objectives: string[];
  actionItems: string[];
}

export interface MindMapNode {
  id: string;
  label: string;
  type: 'core' | 'product' | 'marketing' | 'operations' | 'finance';
  description: string;
  x: number;
  y: number;
}

export interface MindMapLink {
  source: string;
  target: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  links: MindMapLink[];
}

export interface StartupModel {
  context: FounderContext;
  blueprint: LeanBlueprint;
  swot: SWOTAnalysis;
  roadmap: RoadmapMilestone[];
  mindmap: MindMapData;
  visionStatement: string;
  isLocalFallback?: boolean;
  isLiteModel?: boolean;
}

export interface AdvisorMessage {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: string;
}
