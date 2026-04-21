import { listTemplates } from "@/lib/templates";
import AssessmentPicker from "./assessment-picker";

export default function AssessPage() {
  const templates = listTemplates();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            心理健康自助测评
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            选择一份量表开始测评，无需注册登录，结果仅供参考。
          </p>
        </div>

        <AssessmentPicker templates={templates} />

        <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 space-y-1">
          <p>测评结果仅供参考，不构成医学诊断。如有需要，请咨询专业人士。</p>
        </div>
      </div>
    </div>
  );
}
