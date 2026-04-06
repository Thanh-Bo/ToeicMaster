"use client";

import { useState, useRef, useEffect } from "react";

export interface Highlight {
  id: string;
  start: number;
  end: number;
  color: string;
  text: string;
}

interface HighlightTextProps {
  text: string;
  questionId: number;
  highlights?: Highlight[];
  onHighlightsChange?: (highlights: Highlight[]) => void;
}

const HIGHLIGHT_COLORS = [
  { name: "yellow", bg: "bg-yellow-200", class: "bg-yellow-200/70" },
  { name: "green", bg: "bg-green-200", class: "bg-green-200/70" },
  { name: "blue", bg: "bg-blue-200", class: "bg-blue-200/70" },
  { name: "pink", bg: "bg-pink-200", class: "bg-pink-200/70" },
  { name: "purple", bg: "bg-purple-200", class: "bg-purple-200/70" },
  { name: "orange", bg: "bg-orange-200", class: "bg-orange-200/70" },
  { name: "red", bg: "bg-red-200", class: "bg-red-200/70" },
  { name: "teal", bg: "bg-teal-200", class: "bg-teal-200/70" },
];

// Helper to check if text contains HTML tags
const containsHtml = (content: string): boolean => {
  return /<\s*\/?\s*[a-z][^>]*>/i.test(content);
};

export default function HighlightText({ 
  text, 
  questionId, 
  highlights: initialHighlights = [],
  onHighlightsChange 
}: HighlightTextProps) {
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
  const [showPalette, setShowPalette] = useState(false);
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number; text: string } | null>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  // If text contains HTML, render it directly without highlighting
  if (containsHtml(text)) {
    return (
      <div
        className="whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  // Load highlights from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`highlights_q${questionId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHighlights(parsed);
      } catch (e) {
        console.error("Failed to load highlights:", e);
      }
    }
  }, [questionId]);

  // Global mouse up handler - works when releasing anywhere on page
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        return;
      }

      const range = selection.getRangeAt(0);
      
      // Check if selection is within our text element
      if (!textRef.current || !textRef.current.contains(range.commonAncestorContainer)) {
        return;
      }

      // Calculate character positions
      const preCaretRange = document.createRange();
      preCaretRange.selectNodeContents(textRef.current);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      const start = preCaretRange.toString().length;

      preCaretRange.setEnd(range.endContainer, range.endOffset);
      const end = preCaretRange.toString().length;

      const selectedText = range.toString().trim();
      if (!selectedText) return;

      setSelectionRange({ start, end, text: selectedText });
      setShowPalette(true);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Save highlights to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`highlights_q${questionId}`, JSON.stringify(highlights));
    onHighlightsChange?.(highlights);
  }, [highlights, questionId, onHighlightsChange]);

  // Close palette when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        setShowPalette(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return;
    }

    const range = selection.getRangeAt(0);
    
    // Check if selection is within our text element
    if (!textRef.current || !textRef.current.contains(range.commonAncestorContainer)) {
      return;
    }

    // Calculate character positions
    const preCaretRange = document.createRange();
    preCaretRange.selectNodeContents(textRef.current);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    const start = preCaretRange.toString().length;

    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const end = preCaretRange.toString().length;

    const selectedText = range.toString().trim();
    if (!selectedText) return;

    setSelectionRange({ start, end, text: selectedText });
    setShowPalette(true);
  };

  const handleColorSelect = (colorClass: string) => {
    if (!selectionRange) return;

    // Check for overlapping highlights
    const overlapping = highlights.find(
      h => (selectionRange.start >= h.start && selectionRange.start < h.end) ||
           (selectionRange.end > h.start && selectionRange.end <= h.end) ||
           (selectionRange.start <= h.start && selectionRange.end >= h.end)
    );

    if (overlapping) {
      // Update existing highlight
      setHighlights(prev => prev.map(h => 
        h.id === overlapping.id 
          ? { ...h, color: colorClass }
          : h
      ));
    } else {
      // Add new highlight
      const newHighlight: Highlight = {
        id: `hl_${Date.now()}`,
        start: selectionRange.start,
        end: selectionRange.end,
        color: colorClass,
        text: selectionRange.text,
      };
      setHighlights(prev => [...prev, newHighlight]);
    }

    setShowPalette(false);
    setSelectionRange(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleRemoveHighlight = (highlightId: string) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
  };

  // Render text with highlights
  const renderHighlightedText = () => {
    if (highlights.length === 0) {
      return text;
    }

    // Sort highlights by start position
    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    
    const parts: React.JSX.Element[] = [];
    let lastIndex = 0;

    sorted.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`text_${index}`} className="whitespace-pre-wrap">
            {text.slice(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      const colorObj = HIGHLIGHT_COLORS.find(c => c.class === highlight.color);
      parts.push(
        <span
          key={highlight.id}
          className={`${highlight.color} cursor-pointer hover:opacity-80 relative group`}
          onClick={(e) => {
            e.stopPropagation();
            // Show remove button on hover
          }}
        >
          {text.slice(highlight.start, highlight.end)}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveHighlight(highlight.id);
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            type="button"
          >
            ×
          </button>
        </span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="text_end" className="whitespace-pre-wrap">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className="relative">
      <span
        ref={textRef}
        className="cursor-text select-text"
      >
        {renderHighlightedText()}
      </span>

      {/* Color Palette Popup */}
      {showPalette && selectionRange && (
        <div
          ref={paletteRef}
          className="absolute z-50 flex gap-1 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          style={{
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorSelect(color.class)}
              className={`w-6 h-6 rounded ${color.bg} hover:scale-110 transition-transform border border-gray-300 dark:border-gray-600`}
              title={`${color.name} highlight`}
              type="button"
            />
          ))}
          <button
            onClick={() => {
              setShowPalette(false);
              setSelectionRange(null);
              window.getSelection()?.removeAllRanges();
            }}
            className="ml-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            type="button"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
