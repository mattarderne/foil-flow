export type NodeType = 'question' | 'result' | 'transition';

export interface FlowOption {
  label: string;
  nextId: string;
  description?: string;
}

export interface RoadmapStep {
  title: string;
  description: string;
}

export interface Analysis {
  why: string;
  whyNot: string[];
}

export interface FlowNode {
  id: string;
  type: NodeType;
  title: string;
  content: string; // Summary or context
  roadmap?: RoadmapStep[]; // Ordered list of steps/phases
  analysis?: Analysis; // "Why this, why not that"
  options?: FlowOption[];
  // For 'result' types, we might want to link to a progression start node
  progressionLink?: {
    label: string;
    nextId: string;
  };
}

export interface FlowData {
  [key: string]: FlowNode;
}