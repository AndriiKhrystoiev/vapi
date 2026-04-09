"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones } from "@/components/icons";

type Size = "sm" | "md";

interface ListenButtonProps {
  text: string;
  duration: string;
  size?: Size;
  className?: string;
  lang?: string;
  rate?: number;
  pitch?: number;
}

const sizeClasses: Record<Size, string> = {
  md: "h-12 px-5 text-sm",
  sm: "h-10 px-4 text-xs",
};

/**
 * Chunk long text into sentence-sized pieces.
 * Works around Chrome's ~200-char / 15-second utterance limit.
 */
function chunkText(text: string, maxLength = 180): string[] {
  if (!text) return [];
  // First split by sentence boundaries
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";

  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;

    if (sentence.length > maxLength) {
      // A single sentence is too long — split on commas or spaces
      if (current) {
        chunks.push(current);
        current = "";
      }
      const words = sentence.split(/\s+/);
      let piece = "";
      for (const w of words) {
        if ((piece + " " + w).trim().length > maxLength) {
          chunks.push(piece.trim());
          piece = w;
        } else {
          piece = piece ? `${piece} ${w}` : w;
        }
      }
      if (piece) chunks.push(piece.trim());
      continue;
    }

    if ((current + " " + sentence).trim().length > maxLength) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks.filter(Boolean);
}

/** Pick a good voice — prefer high-quality Google/Neural voices. */
function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  const langLower = lang.toLowerCase();
  const langPrefix = langLower.split("-")[0];

  // Priority: Google > Microsoft > Apple enhanced > default match
  return (
    voices.find((v) => /google/i.test(v.name) && v.lang.toLowerCase() === langLower) ||
    voices.find((v) => /google/i.test(v.name) && v.lang.toLowerCase().startsWith(langPrefix)) ||
    voices.find((v) => /microsoft/i.test(v.name) && v.lang.toLowerCase() === langLower) ||
    voices.find((v) => /\(enhanced\)/i.test(v.name) && v.lang.toLowerCase().startsWith(langPrefix)) ||
    voices.find((v) => v.lang.toLowerCase() === langLower && v.default) ||
    voices.find((v) => v.lang.toLowerCase() === langLower) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix))
  );
}

export default function ListenButton({
  text,
  duration,
  size = "md",
  className = "",
  lang = "en-US",
  rate = 1,
  pitch = 1,
}: ListenButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef(0);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stoppedRef = useRef(false);

  // Warm up voices list (Chrome populates it async).
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    synth.getVoices();
    const prime = () => synth.getVoices();
    synth.addEventListener("voiceschanged", prime);
    return () => synth.removeEventListener("voiceschanged", prime);
  }, []);

  const clearKeepAlive = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  // Chrome bug workaround: after ~15s of speech Chrome silently pauses
  // the utterance. Periodically call pause()/resume() to keep it alive.
  const startKeepAlive = useCallback(() => {
    clearKeepAlive();
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    keepAliveRef.current = setInterval(() => {
      if (!synth.speaking) {
        clearKeepAlive();
        return;
      }
      synth.pause();
      synth.resume();
    }, 10000);
  }, [clearKeepAlive]);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    clearKeepAlive();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, [clearKeepAlive]);

  // Speak a single chunk; when it finishes, speak the next one.
  // Stored in a ref so the recursive call inside `onend` always sees
  // the latest function reference without triggering re-renders.
  const speakChunkRef = useRef<(index: number) => void>(() => {});
  useEffect(() => {
    speakChunkRef.current = (index: number) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (stoppedRef.current) return;
      const chunks = chunksRef.current;
      if (index >= chunks.length) {
        setIsPlaying(false);
        clearKeepAlive();
        return;
      }

      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      const voice = pickVoice(lang);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        if (index === 0) startKeepAlive();
      };
      utterance.onend = () => {
        if (stoppedRef.current) return;
        chunkIndexRef.current = index + 1;
        speakChunkRef.current(index + 1);
      };
      utterance.onerror = (event) => {
        // "canceled" / "interrupted" are expected when the user stops — don't log those
        if (event.error !== "canceled" && event.error !== "interrupted") {
          console.warn("SpeechSynthesis error:", event.error);
        }
        clearKeepAlive();
        setIsPlaying(false);
      };

      synth.speak(utterance);
    };
  }, [lang, rate, pitch, startKeepAlive, clearKeepAlive]);

  const handleClick = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (!text) return;

    const synth = window.speechSynthesis;

    // Toggle off if currently playing
    if (synth.speaking || isPlaying) {
      stop();
      return;
    }

    // Prepare chunks
    const chunks = chunkText(text);
    if (!chunks.length) return;
    chunksRef.current = chunks;
    chunkIndexRef.current = 0;
    stoppedRef.current = false;

    // Sanity cancel in case the engine has a stuck queue — but ONLY if nothing
    // is actively speaking (cancel-then-speak in the same tick breaks Chrome).
    if (synth.paused) synth.resume();

    setIsPlaying(true);
    // CRITICAL: call speak() synchronously inside the click handler so mobile
    // browsers accept it as a user-gesture-initiated call.
    speakChunkRef.current(0);
  }, [isPlaying, text, stop]);

  // Stop any ongoing speech on unmount.
  useEffect(() => {
    return () => {
      clearKeepAlive();
      if (typeof window !== "undefined" && window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearKeepAlive]);

  const disabled = !text;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={isPlaying ? "Pause listening" : `Listen, ${duration}`}
      aria-pressed={isPlaying}
      className={`inline-flex items-center gap-3 bg-cream rounded-full font-mono font-medium text-[#0e0e12] uppercase tracking-[1.12px] leading-5 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
    >
      <span>
        {isPlaying ? (
          "Pause"
        ) : (
          <>
            Listen <span className="text-[#0e0e12]/60">{duration}</span>
          </>
        )}
      </span>
      <Headphones />
    </button>
  );
}
