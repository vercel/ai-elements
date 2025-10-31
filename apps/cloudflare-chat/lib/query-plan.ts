/**
 * Utilities for tracking and generating query execution plans
 */

export interface QueryStep {
  id: string;
  description: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  duration?: number;
  result?: any;
  error?: string;
}

export interface QueryPlan {
  id: string;
  query: string;
  steps: QueryStep[];
  startTime: number;
  endTime?: number;
}

/**
 * Generate a query plan based on the user's question
 */
export function generateQueryPlan(query: string): QueryStep[] {
  const steps: QueryStep[] = [];
  const lowerQuery = query.toLowerCase();

  // Step 1: Always analyze the query
  steps.push({
    id: 'analyze',
    description: 'Analyzing query intent and required data sources',
    status: 'pending',
  });

  // Detect what data sources are needed
  const needsCanvas =
    lowerQuery.includes('merchant') ||
    lowerQuery.includes('canvas') ||
    lowerQuery.includes('contact');
  const needsCalls =
    lowerQuery.includes('call') ||
    lowerQuery.includes('conversation') ||
    lowerQuery.includes('phone');
  const needsMessages =
    lowerQuery.includes('message') ||
    lowerQuery.includes('sms') ||
    lowerQuery.includes('text');
  const needsSentiment =
    lowerQuery.includes('sentiment') ||
    lowerQuery.includes('feeling') ||
    lowerQuery.includes('mood') ||
    lowerQuery.includes('positive') ||
    lowerQuery.includes('negative');
  const needsSearch =
    lowerQuery.includes('search') ||
    lowerQuery.includes('find') ||
    lowerQuery.includes('look for') ||
    lowerQuery.includes('about');
  const needsTimeline =
    lowerQuery.includes('timeline') ||
    lowerQuery.includes('history') ||
    lowerQuery.includes('interactions');
  const needsStats =
    lowerQuery.includes('stats') ||
    lowerQuery.includes('statistics') ||
    lowerQuery.includes('analytics') ||
    lowerQuery.includes('dashboard');

  // Step 2: Semantic search if needed
  if (needsSearch) {
    steps.push({
      id: 'vectorize',
      description: 'Searching Vectorize index for semantic matches',
      status: 'pending',
    });
  }

  // Step 3: D1 database query
  if (needsCalls || needsMessages || needsSentiment) {
    steps.push({
      id: 'd1_query',
      description: 'Querying D1 database for sync history and analytics',
      status: 'pending',
    });
  }

  // Step 4: Notion Canvas lookup
  if (needsCanvas) {
    steps.push({
      id: 'canvas',
      description: 'Fetching Canvas records from Notion',
      status: 'pending',
    });
  }

  // Step 5: Build timeline
  if (needsTimeline) {
    steps.push({
      id: 'timeline',
      description: 'Building chronological timeline of interactions',
      status: 'pending',
    });
  }

  // Step 6: Stats aggregation
  if (needsStats) {
    steps.push({
      id: 'stats',
      description: 'Aggregating statistics and metrics',
      status: 'pending',
    });
  }

  // Step 7: Always aggregate results
  steps.push({
    id: 'aggregate',
    description: 'Aggregating and formatting results',
    status: 'pending',
  });

  return steps;
}

/**
 * Update a step in the query plan
 */
export function updateQueryStep(
  plan: QueryPlan,
  stepId: string,
  update: Partial<QueryStep>
): QueryPlan {
  return {
    ...plan,
    steps: plan.steps.map((step) =>
      step.id === stepId ? { ...step, ...update } : step
    ),
  };
}

/**
 * Mark the next pending step as active
 */
export function activateNextStep(plan: QueryPlan): QueryPlan {
  const nextPendingIndex = plan.steps.findIndex(
    (step) => step.status === 'pending'
  );

  if (nextPendingIndex === -1) return plan;

  return {
    ...plan,
    steps: plan.steps.map((step, index) =>
      index === nextPendingIndex ? { ...step, status: 'active' } : step
    ),
  };
}

/**
 * Complete the current active step
 */
export function completeActiveStep(
  plan: QueryPlan,
  result?: any
): QueryPlan {
  return {
    ...plan,
    steps: plan.steps.map((step) =>
      step.status === 'active'
        ? { ...step, status: 'complete', result }
        : step
    ),
  };
}
