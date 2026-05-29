"use client";

import { useState, useMemo } from "react";
import { Languages, FileText } from "lucide-react";
import type { ReadingPassage } from "../../types";

interface Props {
  passage: ReadingPassage;
  currentIndex: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Split HTML by <hr> separators for double/triple passages. */
function splitDocuments(html: string | null): string[] {
  if (!html) return ["<p>No passage content.</p>"];
  const parts = html.split(/<hr\s*\/?>/gi).map((s) => s.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [html];
}

/** Extract all <p> blocks from an HTML string. */
function extractParagraphs(html: string): string[] {
  // Match <p ...>content</p> or <p>content</p>
  const matches = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
  return matches && matches.length > 0
    ? matches
    : [html]; // fallback: treat whole block as one paragraph
}

/** Derive a readable label from passageType. */
function passageTypeLabel(passage: ReadingPassage): string | null {
  const pt = (passage.passageType || "").toLowerCase();
  if (pt === "double") return "Double passage";
  if (pt === "triple") return "Triple passage";
  return null;
}

// ---------------------------------------------------------------------------
// Sub-component: single document card
// ---------------------------------------------------------------------------

function DocumentCard({
  index,
  total,
  htmlContent,
  imageUrl,
}: {
  index: number;
  total: number;
  htmlContent: string;
  imageUrl?: string | null;
}) {
  const paragraphs = useMemo(() => extractParagraphs(htmlContent), [htmlContent]);

  return (
    <div
      className="document-card rounded-xl border border-gray-150 bg-gray-50/40 p-5 dark:border-zinc-700/60 dark:bg-zinc-900/40"
    >
      {/* Label */}
      {total > 1 && (
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
            <FileText className="h-3 w-3" />
            Document {index + 1}
          </span>
        </div>
      )}

      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Document ${index + 1}`}
          className="mb-4 max-h-64 w-full rounded-lg object-contain border border-gray-100 dark:border-zinc-800"
        />
      )}

      {/* Paragraphs */}
      <div className="space-y-3">
        {paragraphs.map((pHtml, i) => (
          <div
            key={i}
            className="document-paragraph text-[15px] leading-[1.7] text-gray-800 dark:text-zinc-200"
            dangerouslySetInnerHTML={{ __html: pHtml }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ReadingPassageView({ passage, currentIndex, total }: Props) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [activeDocument, setActiveDocument] = useState(0);
  const hasTranslation = !!passage.textContentTranslation;

  const documents = useMemo(() => splitDocuments(passage.textContent), [passage.textContent]);
  const isMultiDoc = documents.length > 1;
  const typeLabel = passageTypeLabel(passage);

  // Translation documents (split the same way)
  const translationDocs = useMemo(
    () => (passage.textContentTranslation ? splitDocuments(passage.textContentTranslation) : []),
    [passage.textContentTranslation],
  );

  return (
    <section className="lg:sticky lg:top-24 self-start flex max-h-[calc(100vh-140px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-950">
      {/* ── Header ── */}
      <div className="shrink-0 border-b border-gray-100 px-6 pt-5 pb-3 dark:border-zinc-800">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Passage {currentIndex + 1} / {total}
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-gray-950 dark:text-white">
              {passage.title || `Part ${passage.partType} Reading`}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {hasTranslation && (
              <button
                type="button"
                onClick={() => setShowTranslation((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  showTranslation
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
                title={showTranslation ? "Ẩn bản dịch" : "Hiện bản dịch"}
              >
                <Languages className="h-3.5 w-3.5" />
                {showTranslation ? "Ẩn dịch" : "Song ngữ"}
              </button>
            )}
            <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-zinc-900 dark:text-zinc-300">
              Part {passage.partType}
            </div>
          </div>
        </div>

        {/* Badge for double/triple */}
        {typeLabel && (
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            <FileText className="h-3 w-3" />
            {typeLabel} • {passage.questions.length} questions
          </div>
        )}
      </div>

      {/* ── Tabs (multi-doc only) ── */}
      {isMultiDoc && (
        <div className="shrink-0 flex border-b border-gray-100 dark:border-zinc-800">
          {documents.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveDocument(i)}
              className={`flex-1 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeDocument === i
                  ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <FileText className="mr-1.5 inline-block h-3 w-3" />
              Document {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* ── Content: English always visible ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {isMultiDoc ? (
          <DocumentCard
            index={activeDocument}
            total={documents.length}
            htmlContent={documents[activeDocument]}
            imageUrl={activeDocument === 0 ? passage.imageUrl : undefined}
          />
        ) : (
          /* Single document – show all paragraphs */
          <div className="space-y-5">
            {passage.imageUrl && (
              <img
                src={passage.imageUrl}
                alt={passage.title || "Reading passage"}
                className="max-h-80 w-full rounded-xl object-contain border border-gray-100 dark:border-zinc-800"
              />
            )}
            {extractParagraphs(documents[0] || "").map((p, i) => (
              <div
                key={i}
                className="document-paragraph text-[15px] leading-[1.7] text-gray-800 dark:text-zinc-200"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>
        )}

        {/* ── Translation: shown/hidden below English ── */}
        {showTranslation && hasTranslation && (
          <div className="mt-5 border-t border-gray-200 dark:border-zinc-800  pt-4 ">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Bản dịch tiếng Việt
            </p>
            {isMultiDoc ? (
              <div className="space-y-6">
                {translationDocs.map((doc, i) => (
                  <div key={i}>
                    {translationDocs.length > 1 && (
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Document {i + 1}
                        </span>
                      </div>
                    )}
                    <div
                      className="document-paragraph text-[15px] leading-[1.7] text-gray-700 dark:text-zinc-300"
                      dangerouslySetInnerHTML={{ __html: doc }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {extractParagraphs(passage.textContentTranslation || "").map((p, i) => (
                  <div
                    key={i}
                    className="text-[15px] leading-[1.7] text-gray-700 dark:text-zinc-300"
                    dangerouslySetInnerHTML={{ __html: p }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
