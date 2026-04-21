"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  slug: string;
  name: string;
  description: string;
}

const SCALE_META: Record<string, { icon: string; tags: string[] }> = {
  "phq-9": { icon: "💭", tags: ["抑郁筛查", "9 题", "约 2 分钟"] },
  "gad-7": { icon: "😰", tags: ["焦虑筛查", "7 题", "约 2 分钟"] },
  "sss":   { icon: "🩺", tags: ["躯体化症状", "20 题", "约 5 分钟"] },
};

export default function AssessmentPicker({ templates }: { templates: Template[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleStart(slug: string) {
    setLoading(slug);
    try {
      const res = await fetch("/api/v1/public-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_slug: slug }),
      });

      if (!res.ok) throw new Error("创建失败");

      const data = await res.json();
      router.push(data.assessment_url);
    } catch {
      setLoading(null);
      alert("创建测评会话失败，请重试");
    }
  }

  return (
    <div className="space-y-4">
      {templates.map((t) => {
        const meta = SCALE_META[t.slug] || { icon: "📋", tags: [] };
        const isLoading = loading === t.slug;

        return (
          <button
            key={t.id}
            onClick={() => handleStart(t.slug)}
            disabled={loading !== null}
            className="w-full text-left p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0 mt-0.5">{meta.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {t.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 mt-2 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 transition-colors">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
