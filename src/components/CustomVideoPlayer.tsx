'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactPlayer from 'react-player';

interface CustomVideoPlayerProps {
  url: string;
  title: string;
  subtitle: string;
}

export default function CustomVideoPlayer({ url, title, subtitle }: CustomVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);

  // ── Reset state whenever the URL changes (language switch) ─────────────────
  useEffect(() => {
    setPlaying(false);
    setReady(false);
    setShowOverlay(true);
  }, [url]);

  const handleReady = useCallback(() => {
    setReady(true);
  }, []);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    setShowOverlay(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!ready) return;
    const next = !playing;
    setPlaying(next);
    setShowOverlay(!next); // hide overlay while playing; show on pause
  }, [playing, ready]);

  return (
    <div className="group flex flex-col gap-0 rounded-2xl overflow-hidden border border-zinc-800 bg-neutral-900/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.12)] transition-shadow duration-500">

      {/* ── Video wrapper ─────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-video bg-black overflow-hidden">

        {/* react-player — pointer-events-none prevents native YT clicks */}
        <div className="absolute inset-0 pointer-events-none">
          <ReactPlayer
            ref={playerRef}
            url={url}
            playing={playing}
            onReady={handleReady}
            onEnded={handleEnded}
            width="100%"
            height="100%"
            config={{
              playerVars: {
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3,
                disablekb: 1,
                fs: 0,
                playsinline: 1,
              },
            }}
          />
        </div>

        {/* ── Loading skeleton ─────────────────────────────────────────────── */}
        {!ready && (
          <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center z-10">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
          </div>
        )}

        {/* ── Custom overlay ───────────────────────────────────────────────── */}
        <div
          role="button"
          aria-label={playing ? 'Pauza' : 'Odtwórz'}
          tabIndex={0}
          onClick={togglePlay}
          onKeyDown={(e) => e.key === 'Enter' && togglePlay()}
          className={[
            'absolute inset-0 z-20 flex items-center justify-center cursor-pointer',
            'transition-all duration-300',
            showOverlay || !playing
              ? 'bg-black/40 opacity-100'
              : 'bg-transparent opacity-0 hover:opacity-100 hover:bg-black/20',
          ].join(' ')}
        >
          <div
            className={[
              'w-20 h-20 rounded-full flex items-center justify-center',
              'bg-emerald-500/90 backdrop-blur-md shadow-xl shadow-emerald-500/30',
              'transition-transform duration-300',
              ready ? 'scale-100 hover:scale-110' : 'scale-75 opacity-50',
            ].join(' ')}
          >
            {playing ? (
              <PauseIcon className="w-9 h-9 text-white" />
            ) : (
              <PlayIcon className="w-9 h-9 text-white ml-1" />
            )}
          </div>
        </div>
      </div>

      {/* ── Card footer ───────────────────────────────────────────────────── */}
      <div className="px-5 py-4 flex flex-col gap-1 border-t border-zinc-800/60">
        <h3 className="text-base font-bold tracking-tight text-white leading-tight">
          {title}
        </h3>
        <p className="text-xs font-medium text-emerald-400/80 uppercase tracking-widest">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ── Minimal inline icons ──────────────────────────────────────────────────────

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
