import type { Editor } from "@tiptap/react";

const WORD_COUNT_REGEX = /\s+/;
export const getWordCount = (editor: Editor | null): number => {
  if (!editor) return 0;

  const text = editor.getText();
  const words = text
    .trim()
    .split(WORD_COUNT_REGEX)
    .filter((word) => word.length > 0);
  return words.length;
};

export const getCharacterCount = (editor: Editor | null): number => {
  if (!editor) return 0;
  return editor.getText().length;
};

export const calculateReadingTime = (wordCount: number): number => {
  const wordsPerMinute = 225;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
};

export const formatReadingTime = (minutes: number): string => {
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
};

export const formatWordCount = (count: number): string => {
  if (count === 0) return "0 words";
  if (count === 1) return "1 word";
  return `${count.toLocaleString()} words`;
};

export const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    const validProtocols = ["http:", "https:"];
    if (!validProtocols.includes(urlObj.protocol)) return false;

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const pathname = urlObj.pathname.toLowerCase();
    return (
      imageExtensions.some((ext) => pathname.endsWith(ext)) ||
      pathname.includes("/image")
    );
  } catch {
    return false;
  }
};
