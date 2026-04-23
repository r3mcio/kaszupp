'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import { videoDemos, type Lang } from '@/data/videoDemos';

export default function VideoDemosSection() {
  const locale = useLocale();
  const [lang, setLang] = useState<Lang>(locale === 'pl' ? 'pl' : 'en');

  return (
    <section
      id="demos"
      className="w-full scroll-mt-28 py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
    >
      {/* ── Section header ──────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
            {lang === 'pl' ? 'Dema Głosu' : 'Voice Demos'}
          </h2>
        </div>

        {/* ── Language toggle ────────────────────────────────────────────── */}
        <div
          role="group"
          aria-label="Wybór języka dem"
          className="flex items-center gap-1 bg-black/50 p-1.5 rounded-full border border-zinc-800 backdrop-blur-sm shadow-inner shrink-0"
        >
          {(['pl', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={[
                'min-w-[72px] h-9 px-4 rounded-full text-sm font-bold tracking-wide transition-all duration-300',
                lang === l
                  ? 'bg-emerald-500 text-white shadow-[0_0_18px_rgba(16,185,129,0.45)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5',
              ].join(' ')}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Video grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {videoDemos.map((demo) => (
          <CustomVideoPlayer
            key={`${demo.id}-${lang}`}   // force remount on lang change → clean reset
            url={demo.videoUrl[lang]}
            title={demo.title[lang]}
            subtitle={demo.subtitle[lang]}
          />
        ))}
      </div>
    </section>
  );
}
