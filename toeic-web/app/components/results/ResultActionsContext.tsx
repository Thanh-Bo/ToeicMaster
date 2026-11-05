"use client";

import { createContext, useContext } from "react";

interface ResultActions {
  /** True when the current user is an admin (server endpoint enforces it too). */
  canRegenerateExplanation: boolean;
  /** Question ids currently being regenerated. */
  regeneratingIds: Set<number>;
  /** Regenerate the AI explanation of one question. */
  onRegenerateExplanation: (questionId: number) => void;
  /** Question ids the user flagged for later review during this attempt. */
  flaggedIds: Set<number>;
}

const ResultActionsContext = createContext<ResultActions>({
  canRegenerateExplanation: false,
  regeneratingIds: new Set<number>(),
  onRegenerateExplanation: () => {},
  flaggedIds: new Set<number>(),
});

export const ResultActionsProvider = ResultActionsContext.Provider;

export function useResultActions() {
  return useContext(ResultActionsContext);
}
