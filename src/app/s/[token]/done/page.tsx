import { headers } from "next/headers";
import { hashApiKey } from "@/lib/auth";
import { findTemplateBySlug } from "@/lib/templates";
import { getSessionByTokenHash, getResponseBySessionId } from "@/lib/store";
import { notFound } from "next/navigation";
import CopyLinkButton from "./copy-link-button";

interface Props {
  params: Promise<{ token: string }>;
}

const RISK_LEVEL_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "正常": { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500" },
  "轻度": { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-500" },
  "中度": { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800", dot: "bg-orange-500" },
  "重度": { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800", dot: "bg-red-500" },
};

const DEFAULT_STYLE = { bg: "bg-zinc-50 dark:bg-zinc-900", text: "text-zinc-700 dark:text-zinc-300", border: "border-zinc-200 dark:border-zinc-800", dot: "bg-zinc-500" };

export default async function AssessmentDonePage({ params }: Props) {
  const { token } = await params;
  const tokenHash = await hashApiKey(token);

  const session = await getSessionByTokenHash(tokenHash);
  if (!session) notFound();

  if (session.status !== "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-5xl">📋</div>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            问卷尚未完成
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            该问卷还未提交，请先完成填写。
          </p>
        </div>
      </div>
    );
  }

  const response = await getResponseBySessionId(session.id);
  if (!response) notFound();

  const template = findTemplateBySlug(session.template_slug);
  const maxScore = template
    ? Math.max(...template.scoring_rules.risk_levels.map((r) => r.max))
    : null;
  const scorePercent = maxScore ? Math.round((response.raw_score / maxScore) * 100) : null;
  const riskStyle = RISK_LEVEL_STYLES[response.risk_level] ?? DEFAULT_STYLE;

  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const resultUrl = `${proto}://${host}/s/${token}/done`;

  const completedDate = response.completed_at
    ? new Date(response.completed_at).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const dimensions = template?.scoring_rules.dimensions;
  const dimensionScores = response.dimension_scores;

  return (
    <div
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-6 sm:py-8 px-4"
      style={{ paddingLeft: "max(1rem, var(--sal))", paddingRight: "max(1rem, var(--sar))" }}
    >
      <div className="max-w-lg mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            测评报告
          </h1>
          {template && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {template.name}
            </p>
          )}
          {completedDate && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              完成时间：{completedDate}
            </p>
          )}
        </div>

        {/* Risk Level */}
        <div className={`p-4 sm:p-6 rounded-2xl border-2 ${riskStyle.bg} ${riskStyle.border}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                评估结果
              </p>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${riskStyle.dot}`} />
                <span className={`text-2xl font-bold ${riskStyle.text}`}>
                  {response.risk_level}
                </span>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                总分
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {response.raw_score}
                {maxScore !== null && (
                  <span className="text-base font-normal text-zinc-400 dark:text-zinc-500">
                    /{maxScore}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Score bar */}
          {scorePercent !== null && (
            <div className="mt-4">
              <div className="h-3 bg-white/60 dark:bg-zinc-800/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${riskStyle.dot}`}
                  style={{ width: `${Math.min(scorePercent, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                {template?.scoring_rules.risk_levels.map((level) => (
                  <span key={level.label} className="text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500">
                    {level.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dimension Scores */}
        {dimensions && dimensions.length > 0 && dimensionScores && (
          <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 sm:mb-4">
              维度得分
            </h2>
            <div className="space-y-3">
              {dimensions.map((dim) => {
                const score = dimensionScores[dim.id] ?? 0;
                const dimMax = dim.question_ids.length * Math.max(
                  ...template.schema.questions
                    .filter((q) => dim.question_ids.includes(q.id))
                    .flatMap((q) => q.options.map((o) => o.value))
                );
                const pct = dimMax > 0 ? Math.round((score / dimMax) * 100) : 0;

                return (
                  <div key={dim.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-700 dark:text-zinc-300">{dim.name}</span>
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {score}/{dimMax}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Question Details */}
        {template && (
          <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 sm:mb-4">
              逐题作答详情
            </h2>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {template.schema.questions.map((q, idx) => {
                const value = response.answers[q.id];
                const selectedOption = q.options.find((o) => o.value === value);
                return (
                  <div key={q.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {q.text}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                          {selectedOption ? (
                            <>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${riskStyle.bg} ${riskStyle.text}`}>
                                {selectedOption.label}
                              </span>
                              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                {value} 分
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                              未作答
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Share Link */}
        <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            分享给医生
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            复制以下链接发送给您的咨询师或医生，对方打开即可查看本次测评结果。
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1 px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 truncate select-all">
              {resultUrl}
            </div>
            <CopyLinkButton url={resultUrl} />
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="text-center space-y-2 pt-2"
          style={{ paddingBottom: "max(1rem, var(--sab))" }}
        >
          <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
            本测评结果仅供参考，不构成临床诊断。
            <br />
            如有需要，请咨询专业心理健康人员。
          </p>
        </div>
      </div>
    </div>
  );
}
