import { TemplateDefinition } from "@/types/database";

export const GAD7_TEMPLATE: TemplateDefinition = {
  id: "f7c0d7c9-6306-4bc2-9f60-6792d9f1c1d2",
  slug: "gad-7",
  name: "GAD-7 广泛性焦虑障碍量表",
  description:
    "Generalized Anxiety Disorder-7，用于筛查和评估广泛性焦虑障碍的标准化工具。",
  version: "1.0.0",
  schema: {
    instructions:
      "在过去两周里，以下问题对您困扰的频率如何？请选择最符合您情况的选项。",
    questions: [
      {
        id: "gad7_q1",
        text: "感到不安、担心、烦躁或者易怒",
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
        id: "gad7_q2",
        text: "不能停止或无法控制担心",
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
        id: "gad7_q3",
        text: "对各种各样的事情担忧过多",
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
        id: "gad7_q4",
        text: "很紧张，无法放松",
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
        id: "gad7_q5",
        text: "非常焦躁，以至无法静坐",
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
        id: "gad7_q6",
        text: "变得很易怒或躁动",
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
        id: "gad7_q7",
        text: "担忧会有不祥的事情发生",
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
      { label: "中度", min: 10, max: 17 },
      { label: "重度", min: 18, max: 21 },
    ],
  },
};
