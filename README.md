# Agent Scale

面向 AI Agent 的标准化心理量表测评微服务。

当前版本已经去掉了对 Supabase SDK 的运行时依赖，应用直接连接 PostgreSQL。你可以：

- 连接本地 PostgreSQL，自建完整本地化部署
- 连接任意兼容 PostgreSQL 的托管实例
- 继续连接 Supabase 的数据库连接串，但不再依赖 Supabase Data API

## 特性

- 内置模板直接来自代码，不再在运行时读取 `assessment_templates` 表
- 服务端统一使用 `pg` 访问数据库
- 支持本地服务器 + 本地 PostgreSQL 的纯内网部署
- 提供 `db:migrate` 脚本初始化数据库

## 环境变量

参考 [.env.example](.env.example)：

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/agent_scale
DATABASE_SSL=disable
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

说明：

- `DATABASE_URL`：应用连接 PostgreSQL 的标准连接串
- `DATABASE_SSL`：本地数据库通常填 `disable`
- 如果你连接的是云上 PostgreSQL / Supabase 直连数据库，通常改成 `require`

## 本地启动

1. 准备一个 PostgreSQL 数据库
2. 复制环境变量模板
3. 执行数据库迁移
4. 启动应用

```bash
cp .env.example .env.local
npm install
npm run db:migrate
npm run dev
```

## 数据库迁移

迁移文件位于 [supabase/migrations](supabase/migrations)。

虽然目录名还叫 `supabase/migrations`，但其中 SQL 现在用于普通 PostgreSQL 也可直接执行。`npm run db:migrate` 会按文件名顺序自动应用：

- `001_initial_schema.sql`
- `002_seed_templates.sql`
- `003_sessions_template_slug.sql`

其中第三条迁移会把 `sessions` 对模板的运行时依赖从外键读取切到 `template_slug`。

## 部署建议

- 中国大陆本地化部署：应用服务器和 PostgreSQL 放在同一地域或同一私网
- 如果模板不常改，当前实现已经不会因为首屏渲染去跨库读模板
- 若迁移历史库，请先执行 `npm run db:migrate`，确保 `template_slug` 已回填
