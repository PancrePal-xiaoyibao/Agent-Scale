import { hashApiKey } from "@/lib/auth";
import { findTemplateBySlug } from "@/lib/templates";
import { notFound } from "next/navigation";
import { getSessionByTokenHash } from "@/lib/store";
import AssessmentForm from "./assessment-form";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function AssessmentPage({ params }: Props) {
  const { token } = await params;
  const tokenHash = await hashApiKey(token);

  const session = await getSessionByTokenHash(tokenHash);

  if (!session) {
    notFound();
  }

  if (session.status === "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            问卷已完成
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            您已提交过此问卷，无需重复填写。
          </p>
        </div>
      </div>
    );
  }

  if (
    session.status === "expired" ||
    new Date(session.expires_at) < new Date()
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-5xl">⏰</div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            链接已过期
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            此测评链接已失效，请联系您的咨询师获取新链接。
          </p>
        </div>
      </div>
    );
  }

  const template = findTemplateBySlug(session.template_slug);

  if (!template) {
    notFound();
  }

  const schema = template.schema;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {template.name}
          </h1>
          {template.description && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {template.description}
            </p>
          )}
        </div>

        {schema.instructions && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {schema.instructions}
            </p>
          </div>
        )}

        <AssessmentForm
          questions={schema.questions}
          token={token}
        />
      </div>
    </div>
  );
}
