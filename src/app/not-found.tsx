export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-5xl">🔍</div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          页面未找到
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          您访问的测评链接无效，请确认链接是否正确。
        </p>
      </div>
    </div>
  );
}
