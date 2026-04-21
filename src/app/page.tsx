import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-2xl mx-auto px-6 py-32 text-center space-y-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Agent Scale
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto">
          面向 AI Agent 的标准化心理量表测评微服务。
          <br />
          通过 API 集成，实现对话式干预与标准化评估的闭环。
        </p>

        <Link
          href="/assess"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm hover:shadow-md"
        >
          开始自助测评
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              标准量表
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              PHQ-9、GAD-7、SSS 等专业量表内置支持
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              API 集成
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              RESTful API，Agent 可无缝调用创建测评会话
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              安全可控
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              限时 Token、数据隔离、结果仅 API 可查
            </p>
          </div>
        </div>

        <div className="pt-4 text-sm text-zinc-400 dark:text-zinc-500">
          <code className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
            POST /api/v1/sessions
          </code>
          <span className="mx-2">→</span>
          <code className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
            /s/:token
          </code>
          <span className="mx-2">→</span>
          <code className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
            GET /api/v1/sessions/:id
          </code>
        </div>
      </main>
    </div>
  );
}
