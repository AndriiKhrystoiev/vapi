"use client";

import { useEffect, useState } from "react";
import { useSpeech } from "react-text-to-speech";
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
  /**
   * Preferred voice by display name (`SpeechSynthesisVoice.name`).
   * On Chrome/Edge the default "Google US English" sounds natural; on
   * Safari this voice doesn't exist and we fall through to the system
   * default (which is already good).
   */
  voice?: string;
}

/**
 * Resolve a preferred voice name to a voiceURI using the Web Speech API.
 * Voices load asynchronously in Chrome, so we listen to `voiceschanged`
 * and re-evaluate. Returns `undefined` when nothing matches — leaving the
 * voice unset lets the browser pick its own default (good on Safari).
 */
function useResolvedVoiceURI(voiceName: string, lang: string): string | undefined {
  const [voiceURI, setVoiceURI] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;

    const pick = () => {
      const voices = synth.getVoices();
      if (!voices.length) return;

      // 1. Exact name match
      const exact = voices.find((v) => v.name === voiceName);
      if (exact) {
        setVoiceURI(exact.voiceURI);
        return;
      }

      // 2. Any "Google …" voice for the requested language (Chrome's good voices)
      const langPrefix = lang.toLowerCase().split("-")[0];
      const googleVoice = voices.find(
        (v) => /google/i.test(v.name) && v.lang.toLowerCase().startsWith(langPrefix),
      );
      if (googleVoice) {
        setVoiceURI(googleVoice.voiceURI);
        return;
      }

      // 3. Give up and let the browser default kick in (Safari has nice ones)
      setVoiceURI(undefined);
    };

    pick();
    synth.addEventListener("voiceschanged", pick);
    return () => synth.removeEventListener("voiceschanged", pick);
  }, [voiceName, lang]);

  return voiceURI;
}

const sizeClasses: Record<Size, string> = {
  md: "h-12 px-5 text-sm",
  sm: "h-10 px-4 text-xs",
};

export default function ListenButton({
  text,
  duration,
  size = "md",
  className = "",
  lang = "en-US",
  rate = 1,
  pitch = 1,
  voice = "Google US English",
}: ListenButtonProps) {
  const voiceURI = useResolvedVoiceURI(voice, lang);

  const { speechStatus, start, pause } = useSpeech({
    text,
    lang,
    rate,
    pitch,
    voiceURI,
    // Don't let previous utterances stack up when switching chapters.
    preserveUtteranceQueue: false,
  });

  const isPlaying = speechStatus === "started";
  const disabled = !text;

  const handleClick = () => {
    if (disabled) return;
    if (isPlaying) {
      pause();
    } else {
      start();
    }
  };

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
