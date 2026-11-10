
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import AIOrb from "./AIOrb";

const features = [
  {
    title: "Cognitive Nexus",
    description: "Explore concepts and understand complex ideas.",
    icon: "✧",
  },
  {
    title: "Neural Composer",
    description: "Write, debug and improve your code.",
    icon: "</>",
  },
  {
    title: "AI Construct",
    description: "Design intelligent agents and workflows.",
    icon: "⌘",
  },
  {
    title: "Idea Foundry",
    description: "Turn your ideas into actionable plans.",
    icon: "✳",
  },
];

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) return;

    router.push(
      `/workspace?prompt=${encodeURIComponent(trimmedPrompt)}`
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#080808] px-5 py-8 text-white sm:px-8">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/[0.08] blur-[120px]" />

      {/* Header */}
      <header className="relative z-10 flex w-full max-w-6xl items-center justify-between gap-3">
        <a href="/" className="shrink-0 text-xl font-bold tracking-[0.2em]">
          MANTRIX<span className="text-amber-400">.</span>
        </a>

        <span className="rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-center text-[9px] tracking-[0.12em] text-amber-300 sm:px-4 sm:text-xs sm:tracking-[0.2em]">
          INTELLIGENCE REIMAGINED
        </span>
      </header>

      {/* Hero */}
      <section className="relative z-10 mt-6 flex w-full max-w-5xl flex-col items-center text-center sm:mt-8">
        <p className="text-[10px] tracking-[0.3em] text-amber-400 sm:text-xs">
          YOUR PERSONAL AI UNIVERSE
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          Think beyond
          <span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-700 bg-clip-text text-transparent">
            the ordinary.
          </span>
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
          One intelligent workspace for ideas, code, problem-solving and the
          next generation of AI agents.
        </p>

        {/* AI Orb */}
        <div className="relative mt-4 flex w-full items-center justify-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.08] blur-[70px] sm:h-72 sm:w-72" />

          <div className="relative z-10 flex shrink-0 items-center justify-center">
            <AIOrb />
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <button
              key={feature.title}
              type="button"
              onClick={() => setPrompt(feature.description)}
              className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-amber-400/[0.04]"
            >
              <span className="text-xl text-amber-400 transition group-hover:text-amber-300">
                {feature.icon}
              </span>

              <h2 className="mt-3 text-sm font-semibold text-zinc-100">
                {feature.title}
              </h2>

              <p className="mt-2 text-xs leading-5 text-zinc-500">
                {feature.description}
              </p>
            </button>
          ))}
        </div>

        {/* Prompt composer */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#101010] p-3 transition focus-within:border-amber-400/40 sm:p-4"
        >
          <label htmlFor="mantrix-prompt" className="sr-only">
            Ask MANTRIX
          </label>

          <textarea
            id="mantrix-prompt"
            rows={2}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask MANTRIX anything..."
            className="w-full resize-none bg-transparent px-2 py-2 text-sm leading-6 text-white outline-none placeholder:text-zinc-600"
          />

          <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] pt-3">
            <span className="px-2 text-left text-[10px] text-zinc-600">
              Your ideas start here.
            </span>

            <button
              type="submit"
              disabled={!prompt.trim()}
              className="shrink-0 rounded-xl bg-amber-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Get started ↗
            </button>
          </div>
        </form>

        {/* Footer */}
        <footer className="mt-8 pb-4 text-center text-[10px] tracking-[0.2em] text-zinc-600">
          BUILT TO THINK · DESIGNED TO CREATE
        </footer>
      </section>
    </main>
  );
}
