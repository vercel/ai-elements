/**
 * Hook for managing intelligent suggestions based on user's query history
 */

import { useState, useEffect, useCallback } from 'react';

interface QueryHistory {
  query: string;
  timestamp: number;
  tools: string[];
  hasResults: boolean;
}

const STORAGE_KEY = 'cloudflare-chat-history';
const MAX_HISTORY = 50;

// Base suggestions that are always available
const BASE_SUGGESTIONS = [
  'Show me dashboard statistics',
  'Get cache performance metrics',
  'Find merchants with recent activity',
  'Search for calls about pricing',
  'Show me calls with negative sentiment',
];

/**
 * Generate contextual suggestions based on query history
 */
function generateContextualSuggestions(history: QueryHistory[]): string[] {
  const suggestions: string[] = [];

  if (history.length === 0) {
    return BASE_SUGGESTIONS;
  }

  const recentQueries = history.slice(-10);

  // Analyze recent patterns
  const hasSearchedMerchants = recentQueries.some((q) =>
    q.query.toLowerCase().includes('merchant')
  );
  const hasSearchedCalls = recentQueries.some((q) =>
    q.query.toLowerCase().includes('call')
  );
  const hasSearchedSentiment = recentQueries.some((q) =>
    q.query.toLowerCase().includes('sentiment')
  );
  const hasUsedCanvas = recentQueries.some((q) =>
    q.tools.includes('getMerchantByCanvas')
  );
  const hasUsedSemanticSearch = recentQueries.some((q) =>
    q.tools.includes('searchCallsAndMessages')
  );

  // Generate follow-up suggestions
  if (hasSearchedMerchants) {
    suggestions.push('Show me the timeline for this merchant');
    suggestions.push('Compare this merchant with similar ones');
    suggestions.push('Analyze interaction patterns for this merchant');
  }

  if (hasSearchedCalls) {
    suggestions.push('Show me recent calls with recordings');
    suggestions.push('Analyze call sentiment trends over time');
    suggestions.push('Find calls that mention specific topics');
  }

  if (hasSearchedSentiment) {
    suggestions.push('Show sentiment trends for the past month');
    suggestions.push('Find calls with the most positive sentiment');
    suggestions.push('Identify merchants with negative sentiment');
  }

  if (hasUsedCanvas) {
    suggestions.push('Get all interactions for this Canvas');
    suggestions.push('Show me related Canvas records');
  }

  if (hasUsedSemanticSearch) {
    suggestions.push('Search for similar conversations');
    suggestions.push('Find calls with related topics');
  }

  // Detect query patterns and suggest variations
  const lastQuery = recentQueries[recentQueries.length - 1];
  if (lastQuery) {
    const lowerQuery = lastQuery.query.toLowerCase();

    if (lowerQuery.includes('today')) {
      suggestions.push(lowerQuery.replace('today', 'this week'));
      suggestions.push(lowerQuery.replace('today', 'this month'));
    }

    if (lowerQuery.includes('show me')) {
      suggestions.push(lowerQuery.replace('show me', 'analyze'));
      suggestions.push(lowerQuery.replace('show me', 'compare'));
    }
  }

  // Remove duplicates and limit to reasonable number
  const uniqueSuggestions = Array.from(new Set(suggestions));

  // Add some base suggestions if we don't have enough
  while (uniqueSuggestions.length < 5 && uniqueSuggestions.length < BASE_SUGGESTIONS.length + suggestions.length) {
    const randomBase = BASE_SUGGESTIONS[Math.floor(Math.random() * BASE_SUGGESTIONS.length)];
    if (!uniqueSuggestions.includes(randomBase)) {
      uniqueSuggestions.push(randomBase);
    }
  }

  return uniqueSuggestions.slice(0, 8);
}

/**
 * Hook for managing suggestions based on query history
 */
export function useSuggestions() {
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(BASE_SUGGESTIONS);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as QueryHistory[];
        setHistory(parsed);
        setSuggestions(generateContextualSuggestions(parsed));
      }
    } catch (error) {
      console.error('Failed to load query history:', error);
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      setSuggestions(generateContextualSuggestions(history));
    } catch (error) {
      console.error('Failed to save query history:', error);
    }
  }, [history]);

  // Add a query to history
  const addQuery = useCallback(
    (query: string, tools: string[], hasResults: boolean) => {
      setHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            query,
            timestamp: Date.now(),
            tools,
            hasResults,
          },
        ];

        // Keep only the most recent queries
        if (newHistory.length > MAX_HISTORY) {
          return newHistory.slice(-MAX_HISTORY);
        }

        return newHistory;
      });
    },
    []
  );

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setSuggestions(BASE_SUGGESTIONS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get recent queries
  const getRecentQueries = useCallback((limit = 10) => {
    return history.slice(-limit).reverse();
  }, [history]);

  // Get popular queries
  const getPopularQueries = useCallback(() => {
    const queryCounts = new Map<string, number>();

    history.forEach((item) => {
      const normalized = item.query.toLowerCase().trim();
      queryCounts.set(normalized, (queryCounts.get(normalized) || 0) + 1);
    });

    return Array.from(queryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query]) => query);
  }, [history]);

  return {
    suggestions,
    history,
    addQuery,
    clearHistory,
    getRecentQueries,
    getPopularQueries,
  };
}
