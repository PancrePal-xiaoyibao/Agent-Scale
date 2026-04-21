export default function AssessmentDonePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">🎉</div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          问卷提交成功
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          感谢您的耐心填写！您的测评结果已安全提交。
          <br />
          请回复您的咨询师「我已完成问卷」以便继续后续流程。
        </p>
        <div className="pt-4">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            您可以安全关闭此页面
          </p>
        </div>
      </div>
    </div>
  );
}
