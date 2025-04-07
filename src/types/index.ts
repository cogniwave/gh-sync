export enum Action {
  LABELS = "labels",
  WORKFLOWS = "workflows",
  BRANCH_RULES = "branchRules",
}

export interface SyncOptions {
  token?: string;
  tokenOrigin?: string;
  tokenDestination?: string;
  verbose: boolean;
}

export interface Tokens {
  destToken: string;
  originToken: string;
}
