-- Seed built-in assessment templates

insert into assessment_templates (slug, name, description, version, schema, scoring_rules) values
(
  'phq-9',
  'PHQ-9 患者健康问卷（抑郁）',
  'Patient Health Questionnaire-9，用于筛查和评估抑郁症状严重程度的标准化工具。',
  '1.0.0',
  '{
    "instructions": "在过去两周里，以下问题对您困扰的频率如何？请选择最符合您情况的选项。",
    "questions": [
      {"id":"phq9_q1","text":"对事情没有兴趣","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"phq9_q2","text":"感到情绪低下、抑郁、没有希望","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"phq9_q3","text":"无法入睡或睡眠时间过长","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"phq9_q4","text":"感到疲倦或没有精力","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"phq9_q5","text":"没有胃口或狂吃","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"phq9_q6","text":"感到对自己内疚或感到自己是失败者或造成家人不成功","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"phq9_q7","text":"做事时无法精力集中，如读报或看电视","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"phq9_q8","text":"走动或说话相当慢或超出寻常的兴奋和走动","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"phq9_q9","text":"想到最好死了算了或自我伤害","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]}
    ]
  }'::jsonb,
  '{
    "method": "sum",
    "risk_levels": [
      {"label":"正常","min":0,"max":4},
      {"label":"轻度","min":5,"max":9},
      {"label":"中度","min":10,"max":19},
      {"label":"重度","min":20,"max":27}
    ]
  }'::jsonb
),
(
  'gad-7',
  'GAD-7 广泛性焦虑障碍量表',
  'Generalized Anxiety Disorder-7，用于筛查和评估广泛性焦虑障碍的标准化工具。',
  '1.0.0',
  '{
    "instructions": "在过去两周里，以下问题对您困扰的频率如何？请选择最符合您情况的选项。",
    "questions": [
      {"id":"gad7_q1","text":"感到不安、担心、烦躁或者易怒","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"gad7_q2","text":"不能停止或无法控制担心","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"gad7_q3","text":"对各种各样的事情担忧过多","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"gad7_q4","text":"很紧张，无法放松","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"gad7_q5","text":"非常焦躁，以至无法静坐","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"gad7_q6","text":"变得很易怒或躁动","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]},
      {"id":"gad7_q7","text":"担忧会有不祥的事情发生","type":"likert","required":true,"options":[{"label":"从没有","value":0},{"label":"有几天","value":1},{"label":"一半天数","value":2},{"label":"几乎每天","value":3}]}
    ]
  }'::jsonb,
  '{
    "method": "sum",
    "risk_levels": [
      {"label":"正常","min":0,"max":4},
      {"label":"轻度","min":5,"max":9},
      {"label":"中度","min":10,"max":17},
      {"label":"重度","min":18,"max":21}
    ]
  }'::jsonb
),
(
  'sss',
  'SSS 躯体化症状自评量表',
  'Somatic Symptom Scale，用于评估躯体化症状严重程度的自评工具。',
  '1.0.0',
  '{
    "instructions": "您发病过程中可能存在下列各种症状。初诊请根据近半年情况、复诊请根据目前情况选择，症状可多选，并以选择出相关症状最重的作为严重程度分值。",
    "questions": [
      {"id":"sss_q1","text":"头晕、头胀、头重、头痛、眩晕、晕厥或脑鸣","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q2","text":"睡眠问题（入睡困难、浅睡易醒、多梦、噩梦、早醒、失眠或睡眠过多）","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q3","text":"易疲劳乏力、行动困难、精力减退","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q4","text":"兴趣减退、情绪不佳、怕烦、缺乏耐心","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q5","text":"心血管症状（心慌、胸闷、胸痛、气短）","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q6","text":"易着急紧张、担忧害怕、甚至惊恐、濒死感或失控感","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q7","text":"习惯操心、多思多虑、易纠结、遇事总往坏处想","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q8","text":"注意力减退、思考能力下降、健忘甚至迟钝、恍惚","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q9","text":"胃肠症状（胀、痛、返酸、食欲差、便秘、便多、打嗝、口干苦、恶心、消瘦）","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q10","text":"疼痛（颈部、肩部、腰部、背部、腿部等）","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q11","text":"敏感、依赖、易悲伤或伤心哭泣","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q12","text":"手脚关节或身体某部位（麻木、僵硬、抽搐、颤抖、刺痛、怕冷）","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q13","text":"视物模糊、眼睛干涩或胀痛、短期内视力下降","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q14","text":"激动烦躁、生气易怒、对声音过敏、易受惊吓","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q15","text":"追求完美、洁癖、强迫感（强迫思维、强迫行为）","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q16","text":"皮肤过敏、瘙痒、皮疹、或潮红、潮热、多汗","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q17","text":"常关注健康问题、担心自己及家人生病","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q18","text":"呼吸困难、憋闷或窒息感、喜大叹气、咳嗽或胁肋痛","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q19","text":"咽部不适、梗阻感、鼻腔干涩、鼻塞、耳鸣、耳塞","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]},
      {"id":"sss_q20","text":"易尿频、尿急、尿痛、会阴部不适或性功能下降","type":"likert","required":true,"options":[{"label":"没有","value":1},{"label":"轻度","value":2},{"label":"中度","value":3},{"label":"重度","value":4}]}
    ]
  }'::jsonb,
  '{
    "method": "sum",
    "risk_levels": [
      {"label":"正常","min":20,"max":24},
      {"label":"轻度","min":25,"max":39},
      {"label":"中度","min":40,"max":59},
      {"label":"重度","min":60,"max":80}
    ]
  }'::jsonb
)
on conflict (slug) do nothing;
