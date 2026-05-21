"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Crown, Loader, Lock, Unlock } from "lucide-react";
import { adminService } from "@/app/services/adminService";
import type { Grammar, GrammarTopic, QuestionGrammar } from "@/app/types";

interface GrammarGroup {
  id: number;
  groupGuid: string;
  title: string;
  description?: string;
  order: number;
  totalTopics: number;
}

export default function GrammarAdminTab() {
  const [groups, setGroups] = useState<GrammarGroup[]>([]);
  const [topicsByGroup, setTopicsByGroup] = useState<Record<string, GrammarTopic[]>>({});
  const [rulesByTopic, setRulesByTopic] = useState<Record<number, Grammar[]>>({});
  const [questionsByRule, setQuestionsByRule] = useState<Record<number, QuestionGrammar[]>>({});
  const [questionCountsByRule, setQuestionCountsByRule] = useState<Record<number, number>>({});
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set());
  const [expandedRules, setExpandedRules] = useState<Set<number>>(new Set());
  const [savingRuleId, setSavingRuleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await adminService.getGrammarGroups();
      setGroups(data);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = async (group: GrammarGroup) => {
    const next = new Set(expandedGroups);
    if (next.has(group.groupGuid)) {
      next.delete(group.groupGuid);
      setExpandedGroups(next);
      return;
    }

    next.add(group.groupGuid);
    setExpandedGroups(next);

    if (!topicsByGroup[group.groupGuid]) {
      const topics = await adminService.getGrammarTopicsByGroup(group.groupGuid);
      setTopicsByGroup((prev) => ({ ...prev, [group.groupGuid]: topics }));
    }
  };

  const toggleTopic = async (topic: GrammarTopic) => {
    const next = new Set(expandedTopics);
    if (next.has(topic.id)) {
      next.delete(topic.id);
      setExpandedTopics(next);
      return;
    }

    next.add(topic.id);
    setExpandedTopics(next);

    if (!rulesByTopic[topic.id]) {
      const rules = await adminService.getGrammarRulesByTopic(topic.id);
      setRulesByTopic((prev) => ({ ...prev, [topic.id]: rules }));

      const counts = await Promise.all(
        rules.map(async (rule) => {
          const result = await adminService.getGrammarQuestionsByRule(rule.id);
          return [rule.id, result.total] as const;
        }),
      );

      setQuestionCountsByRule((prev) => ({
        ...prev,
        ...Object.fromEntries(counts),
      }));
    }
  };

  const toggleRule = async (rule: Grammar) => {
    const next = new Set(expandedRules);
    if (next.has(rule.id)) {
      next.delete(rule.id);
      setExpandedRules(next);
      return;
    }

    next.add(rule.id);
    setExpandedRules(next);

    if (!questionsByRule[rule.id]) {
      const result = await adminService.getGrammarQuestionsByRule(rule.id);
      setQuestionsByRule((prev) => ({ ...prev, [rule.id]: result.items }));
      setQuestionCountsByRule((prev) => ({ ...prev, [rule.id]: result.total }));
    }
  };

  const toggleRulePremium = async (rule: Grammar) => {
    if (savingRuleId === rule.id) return;

    const nextValue = !rule.isQuestionsPremiumRequired;
    setSavingRuleId(rule.id);
    setRulesByTopic((prev) => {
      const next: Record<number, Grammar[]> = {};
      for (const [topicId, rules] of Object.entries(prev)) {
        next[Number(topicId)] = rules.map((item) =>
          item.id === rule.id
            ? { ...item, isQuestionsPremiumRequired: nextValue }
            : item,
        );
      }
      return next;
    });

    try {
      await adminService.updateGrammarRuleQuestionsAccess(rule.id, nextValue);
    } catch (error) {
      console.error("Failed to update grammar rule question access:", error);
      setRulesByTopic((prev) => {
        const next: Record<number, Grammar[]> = {};
        for (const [topicId, rules] of Object.entries(prev)) {
          next[Number(topicId)] = rules.map((item) =>
            item.id === rule.id
              ? { ...item, isQuestionsPremiumRequired: rule.isQuestionsPremiumRequired }
              : item,
          );
        }
        return next;
      });
    } finally {
      setSavingRuleId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const groupExpanded = expandedGroups.has(group.groupGuid);
        const topics = topicsByGroup[group.groupGuid] || [];

        return (
          <div key={group.groupGuid} className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => void toggleGroup(group)}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/60"
            >
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{group.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{group.totalTopics} topics</div>
              </div>
              {groupExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>

            {groupExpanded && (
              <div className="space-y-3 border-t border-gray-200 p-4 dark:border-gray-700">
                {topics.map((topic) => {
                  const topicExpanded = expandedTopics.has(topic.id);
                  const rules = rulesByTopic[topic.id] || [];
                  const topicQuestionCount = rules.reduce(
                    (sum, rule) => sum + (questionCountsByRule[rule.id] || 0),
                    0,
                  );

                  return (
                    <div key={topic.id} className="rounded-lg border border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => void toggleTopic(topic)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{topic.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {rules.length || topic.totalRules || 0} rules · {topicQuestionCount} questions
                          </div>
                        </div>
                        {topicExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>

                      {topicExpanded && (
                        <div className="space-y-2 border-t border-gray-200 p-3 dark:border-gray-700">
                          {rules.map((rule) => {
                            const ruleExpanded = expandedRules.has(rule.id);
                            const questions = questionsByRule[rule.id] || [];

                            return (
                              <div key={rule.id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <button
                                    type="button"
                                    onClick={() => void toggleRule(rule)}
                                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                  >
                                    {ruleExpanded ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                        <span className="truncate">{rule.ruleName}</span>
                                        {rule.isQuestionsPremiumRequired && <Crown className="h-4 w-4 shrink-0 text-yellow-500" />}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {questionCountsByRule[rule.id] || 0} questions · lesson always free
                                      </div>
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    disabled={savingRuleId === rule.id}
                                    onClick={() => void toggleRulePremium(rule)}
                                    className={`inline-flex min-w-[132px] items-center justify-between gap-2 rounded-full px-2 py-1 text-xs font-semibold transition disabled:cursor-wait disabled:opacity-70 ${
                                      rule.isQuestionsPremiumRequired
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200"
                                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
                                    }`}
                                  >
                                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${rule.isQuestionsPremiumRequired ? "bg-yellow-500" : "bg-emerald-500"}`}>
                                      {savingRuleId === rule.id ? (
                                        <Loader className="h-3.5 w-3.5 animate-spin" />
                                      ) : rule.isQuestionsPremiumRequired ? (
                                        <Lock className="h-3.5 w-3.5" />
                                      ) : (
                                        <Unlock className="h-3.5 w-3.5" />
                                      )}
                                    </span>
                                    <span>{rule.isQuestionsPremiumRequired ? "Premium" : "Free"}</span>
                                  </button>
                                </div>

                                {ruleExpanded && (
                                  <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                                    {questions.length === 0 ? (
                                      <div className="text-sm text-gray-500 dark:text-gray-400">No questions loaded for this rule.</div>
                                    ) : (
                                      questions.map((question) => (
                                        <div key={question.id} className="rounded-md border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800">
                                          <div className="mb-2 flex items-center justify-between gap-3">
                                            <span className="font-semibold text-gray-900 dark:text-white">Question {question.questionNo}</span>
                                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">{question.mode || "all"}</span>
                                          </div>
                                          <p className="mb-2 text-gray-700 dark:text-gray-200">{question.content}</p>
                                          <div className="grid gap-1 sm:grid-cols-2">
                                            {question.answers?.map((answer) => (
                                              <div key={answer.id} className={answer.isCorrect ? "font-semibold text-emerald-600 dark:text-emerald-300" : "text-gray-600 dark:text-gray-300"}>
                                                {answer.label}. {answer.content}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
