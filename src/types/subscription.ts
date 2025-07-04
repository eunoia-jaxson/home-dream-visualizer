export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export interface Recommendation {
  name: string;
  location: string;
  type: string;
  subscriptionType: string;
  minScore: number;
  competition: string;
  price: string;
  canApply: boolean;
}

export interface SubscriptionType {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  requirements: string[];
  maxScore: number;
}

export type SubscriptionTypeKey =
  | 'general_first'
  | 'general_second'
  | 'newlywed'
  | 'first_life'
  | 'multi_child'
  | 'old_parent';
