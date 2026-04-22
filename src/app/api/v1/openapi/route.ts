import { NextRequest, NextResponse } from "next/server";
import { listTemplateSummaries } from "@/lib/templates";

export async function GET(request: NextRequest) {
  const baseUrl =
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    request.nextUrl.origin;

  const templates = listTemplateSummaries();
  const templateSlugs = templates.map((t) => t.slug);

  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Agent Scale — 心理测评微服务 API",
      description:
        "Headless psychometric assessment microservice for AI Agents. " +
        "Agents can list available scales, create time-limited assessment sessions, " +
        "and retrieve scored results after users complete the assessment.",
      version: "1.0.0",
    },
    servers: [{ url: baseUrl }],
    paths: {
      "/api/v1/health": {
        get: {
          operationId: "getHealth",
          summary: "Health check",
          description: "Check service health and database connectivity.",
          responses: {
            "200": {
              description: "Service is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", enum: ["healthy", "degraded"] },
                      version: { type: "string" },
                      services: {
                        type: "object",
                        properties: {
                          database: { type: "string" },
                          templates: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/templates": {
        get: {
          operationId: "listTemplates",
          summary: "List available assessment templates",
          description:
            "Returns summaries of all available assessment templates. " +
            "Use this to present the user with assessment options.",
          responses: {
            "200": {
              description: "List of template summaries",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      templates: {
                        type: "array",
                        items: { $ref: "#/components/schemas/TemplateSummary" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/templates/{slug}": {
        get: {
          operationId: "getTemplate",
          summary: "Get template details with full question schema",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string", enum: templateSlugs },
            },
          ],
          responses: {
            "200": {
              description: "Full template definition including questions",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/TemplateDetail" },
                },
              },
            },
            "404": { description: "Template not found" },
          },
        },
      },
      "/api/v1/agents/register": {
        post: {
          operationId: "registerAgent",
          summary: "Register a new agent (admin only)",
          description:
            "Create a new agent and receive an API key. " +
            "Requires admin authorization via Bearer token.",
          security: [{ AdminBearer: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: {
                      type: "string",
                      description: "Display name for the agent",
                    },
                    org_id: {
                      type: "string",
                      description: "Organization identifier (optional)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Agent created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      agent_id: { type: "string", format: "uuid" },
                      name: { type: "string" },
                      api_key: {
                        type: "string",
                        description: "API key — save it, shown only once",
                      },
                    },
                  },
                },
              },
            },
            "401": { description: "Invalid admin authorization" },
          },
        },
      },
      "/api/v1/sessions": {
        post: {
          operationId: "createSession",
          summary: "Create an assessment session",
          description:
            "Create a new assessment session and get a shareable URL. " +
            "Send this URL to the user to complete the assessment. " +
            "Optionally set a callback_url to receive results via webhook.",
          security: [{ ApiKey: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    template_slug: {
                      type: "string",
                      enum: templateSlugs,
                      description: "Template slug (preferred)",
                    },
                    template_id: {
                      type: "string",
                      format: "uuid",
                      description: "Template UUID (alternative to slug)",
                    },
                    expires_in: {
                      type: "integer",
                      default: 86400,
                      description: "Session expiry in seconds (default: 24h)",
                    },
                    callback_url: {
                      type: "string",
                      format: "uri",
                      description:
                        "Webhook URL — receives POST with scored results when user completes assessment",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Session created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SessionCreated" },
                },
              },
            },
            "400": { description: "Invalid request body" },
            "401": { description: "Invalid API key" },
            "404": { description: "Template not found" },
          },
        },
        get: {
          operationId: "listSessions",
          summary: "List your sessions",
          description: "List sessions created by the authenticated agent.",
          security: [{ ApiKey: [] }],
          parameters: [
            {
              name: "status",
              in: "query",
              schema: {
                type: "string",
                enum: ["pending", "in_progress", "completed", "expired"],
              },
            },
            {
              name: "template_slug",
              in: "query",
              schema: { type: "string", enum: templateSlugs },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 50, maximum: 100 },
            },
          ],
          responses: {
            "200": {
              description: "List of sessions",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      sessions: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Session" },
                      },
                    },
                  },
                },
              },
            },
            "401": { description: "Invalid API key" },
          },
        },
      },
      "/api/v1/sessions/{id}": {
        get: {
          operationId: "getSession",
          summary: "Get session details and results",
          description:
            "Fetch a session's status and, if completed, the scored results " +
            "including per-question breakdown.",
          security: [{ ApiKey: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": {
              description: "Session details with optional result",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      session: { $ref: "#/components/schemas/Session" },
                      result: { $ref: "#/components/schemas/AssessmentResult" },
                    },
                  },
                },
              },
            },
            "401": { description: "Invalid API key" },
            "404": { description: "Session not found" },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        ApiKey: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
          description: "Agent API key obtained from /api/v1/agents/register",
        },
        AdminBearer: {
          type: "http",
          scheme: "bearer",
          description: "Admin key set via ADMIN_API_KEY env var",
        },
      },
      schemas: {
        TemplateSummary: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            slug: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            question_count: { type: "integer" },
            estimated_minutes: { type: "integer" },
            version: { type: "string" },
          },
        },
        TemplateDetail: {
          type: "object",
          description: "Full template with schema and scoring rules",
          allOf: [
            { $ref: "#/components/schemas/TemplateSummary" },
            {
              type: "object",
              properties: {
                schema: {
                  type: "object",
                  properties: {
                    instructions: { type: "string" },
                    questions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          text: { type: "string" },
                          type: { type: "string" },
                          required: { type: "boolean" },
                          options: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                label: { type: "string" },
                                value: { type: "integer" },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                scoring_rules: {
                  type: "object",
                  properties: {
                    method: { type: "string" },
                    risk_levels: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          label: { type: "string" },
                          min: { type: "integer" },
                          max: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        SessionCreated: {
          type: "object",
          properties: {
            session_id: { type: "string", format: "uuid" },
            assessment_url: {
              type: "string",
              format: "uri",
              description: "URL to send to the user for completing the assessment",
            },
            expires_at: { type: "string", format: "date-time" },
            template: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                slug: { type: "string" },
                name: { type: "string" },
              },
            },
          },
        },
        Session: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            status: {
              type: "string",
              enum: ["pending", "in_progress", "completed", "expired"],
            },
            template_slug: { type: "string" },
            created_at: { type: "string", format: "date-time" },
            expires_at: { type: "string", format: "date-time" },
            completed_at: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
          },
        },
        AssessmentResult: {
          type: "object",
          nullable: true,
          description: "Present only when session status is completed",
          properties: {
            raw_score: { type: "integer" },
            max_score: { type: "integer" },
            risk_level: {
              type: "string",
              description: "Severity label: 正常 / 轻度 / 中度 / 重度",
            },
            dimension_scores: {
              type: "object",
              nullable: true,
              additionalProperties: { type: "integer" },
            },
            items: {
              type: "array",
              description: "Per-question breakdown",
              items: {
                type: "object",
                properties: {
                  question_id: { type: "string" },
                  question_text: { type: "string" },
                  selected_value: { type: "integer" },
                  selected_label: { type: "string", nullable: true },
                },
              },
            },
            completed_at: { type: "string", format: "date-time" },
          },
        },
        WebhookPayload: {
          type: "object",
          description:
            "POST payload sent to callback_url when a session completes",
          properties: {
            event: { type: "string", const: "session.completed" },
            session_id: { type: "string", format: "uuid" },
            result: { $ref: "#/components/schemas/AssessmentResult" },
          },
        },
      },
    },
  };

  return NextResponse.json(spec, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
