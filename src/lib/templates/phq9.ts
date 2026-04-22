import { TemplateDefinition } from "@/types/database";

export const PHQ9_TEMPLATE: TemplateDefinition = {
  id: "8f1e6f8d-4d6d-4df8-9c4e-4c76f8a5c901",
  slug: "phq-9",
  name: "PHQ-9 患者健康问卷（抑郁）",
  description:
    "Patient Health Questionnaire-9，用于筛查和评估抑郁症状严重程度的标准化工具。",
  version: "1.0.0",
  category: "depression",
  tags: ["抑郁", "情绪", "PHQ-9", "筛查"],
  schema: {
    instructions:
      "在过去两周里，以下问题对您困扰的频率如何？请选择最符合您情况的选项。",
    questions: [
      {
        id: "phq9_q1",
        text: "对事情没有兴趣",
        type: "likert",
        required: true,
        options: [
          { label: "从没有", value: 0 },
          { label: "有几天", value: 1 },
          { label: "一半天数", value: 2 },
          { label: "几乎每天", value: 3 },
        ],
      },
      {
        id: "phq9_q2",
        text: "感到情绪低下、抑郁、没有希望",
        type: "likert",
        required: true,
        options: [
          { label: "从没有", value: 0 },
          { label: "有几天", value: 1 },
          { label: "一半天数", value: 2 },
          { label: "几乎每天", value: 3 },
        ],
      },
      {
        id: "phq9_q3",
        text: "无法入睡或睡眠时间过长",
        type: "likert",
        required: true,
        options: [
          { label: "从没有", value: 0 },
          { label: "有几天", value: 1 },
          { label: "一半天数", value: 2 },
          { label: "几乎每天", value: 3 },
        ],
      },
      {
        id: "phq9_q4",
        text: "感到疲倦或没有精力",
        type: "likert",
        required: true,
        options: [
          { label: "从没有", value: 0 },
          { label: "有几天", value: 1 },
          { label: "一半天数", value: 2 },
          { label: "几乎每天", value: 3 },
        ],
      },
      {
        id: "phq9_q5",
        text: "没有胃口或狂吃",
        type: "likert",
        required: true,
        options: [
          { label: "从没有", value: 0 },
          { label: "有几天", value: 1 },
          { label: "一半天数", value: 2 },
          { label: "几乎每天", value: 3 },
        ],
      },
      {
        id: "phq9_q6",
        text: "感到对自己内疚或感到自己是失败者或造成家人不成功",
        type: "likert",
        required: true,
        options: [
          { label: "从没有", value: 0 },
          { label: "有几天", value: 1 },
          { label: "一半天数", value: 2 },
          { label: "几乎每天", value: 3 },
        ],
      },
      {
        id: "phq9_q7",
        text: "做事时无法精力集中，如读报或看电视",
        type: "likert",
        required: true,
        options: [
          { label: "从没有", value: 0 },
          { label: "有几天", value: 1 },
          { label: "一半天数", value: 2 },
          { label: "几乎每天", value: 3 },
        ],
      },
      {
        id: "phq9_q8",
        text: "走动或说话相当慢或超出寻常的兴奋和走动",
        type: "likert",
        required: true,
        options: [
          { label: "从没有", value: 0 },
          { label: "有几天", value: 1 },
          { label: "一半天数", value: 2 },
          { label: "几乎每天", value: 3 },
        ],
      },
      {
        id: "phq9_q9",
        text: "想到最好死了算了或自我伤害",
        type: "likert",
        required: true,
        options: [
          { label: "从没有", value: 0 },
          { label: "有几天", value: 1 },
          { label: "一半天数", value: 2 },
          { label: "几乎每天", value: 3 },
        ],
      },
    ],
  },
  scoring_rules: {
    method: "sum",
    risk_levels: [
      { label: "正常", min: 0, max: 4 },
      { label: "轻度", min: 5, max: 9 },
      { label: "中度", min: 10, max: 19 },
      { label: "重度", min: 20, max: 27 },
    ],
  },
};
