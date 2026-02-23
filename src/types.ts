export type FindingType = 'Threat' | 'Exposure';
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type Status = 'New' | 'In Progress' | 'Resolved' | 'Suppressed';

export interface Trait {
  id: string;
  name: string;
  category: 'Reachability' | 'Sensitive Data' | 'Vulnerability' | 'Misconfiguration' | 'Assumability';
}

export interface SimilarFinding {
  id: string;
  resource: string;
  account: string;
  region: string;
}

export interface Finding {
  id: string;
  title: string;
  type: FindingType;
  severity: Severity;
  status: Status;
  count: number;
  impact: number; // 0-100 blast radius score
  resource: string;
  resourceType: string;
  account: string;
  region: string;
  age: string;
  traits: Trait[];
  aiSummary: string;
  similarFindings: SimilarFinding[];
  attackPath?: AttackPathNode;
  remediationSteps: string[];
}

export interface AttackPathNode {
  id: string;
  type: string;
  name: string;
  children: AttackPathNode[];
  traitCount?: number;
  category?: string;
}
