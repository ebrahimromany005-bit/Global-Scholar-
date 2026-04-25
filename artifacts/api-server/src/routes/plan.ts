import { Router, type IRouter } from "express";
import { db, opportunitiesTable, countriesTable } from "@workspace/db";
import { eq, and, or, sql } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

type PlanRequest = {
  targetCountry: string;
  educationLevel: string;
  languageLevel: string;
  budget: string;
  goal?: string;
  fieldOfStudy?: string;
  age?: string;
  experience?: string;
  currentCountry?: string;
};

function parsePlanRequest(input: unknown): PlanRequest | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;
  const req = ["targetCountry", "educationLevel", "languageLevel", "budget"] as const;
  for (const k of req) {
    if (typeof o[k] !== "string" || !(o[k] as string).trim()) return null;
  }
  const optStr = (k: string) =>
    typeof o[k] === "string" && (o[k] as string).trim() ? (o[k] as string) : undefined;
  return {
    targetCountry: o["targetCountry"] as string,
    educationLevel: o["educationLevel"] as string,
    languageLevel: o["languageLevel"] as string,
    budget: o["budget"] as string,
    goal: optStr("goal"),
    fieldOfStudy: optStr("fieldOfStudy"),
    age: optStr("age"),
    experience: optStr("experience"),
    currentCountry: optStr("currentCountry"),
  };
}

const PLAN_SYSTEM_PROMPT = `أنت "مستشار خطة السفر الذكية" في منصة دليل المنح والهجرة العالمي. مهمتك إنشاء خطة سفر مخصصة وواقعية لكل مستخدم بناءً على بياناته فقط (وليس عامة).

أنت تجيب دائماً بصيغة JSON صالحة فقط، بدون أي نص خارج JSON. كل المحتوى داخل JSON يكون باللغة العربية الفصحى البسيطة.

التزم بهذا الشكل بالضبط:
{
  "summary": "ملخص قصير شخصي للخطة في 2-3 أسطر",
  "bestPath": {
    "type": "study | migration | work",
    "title": "عنوان المسار الموصى به",
    "reasoning": "لماذا هذا المسار الأنسب لهذا المستخدم تحديداً (سطرين)"
  },
  "successProbability": {
    "percentage": 75,
    "level": "عالية | متوسطة | منخفضة",
    "factors": ["عامل إيجابي 1", "عامل إيجابي 2", "نقطة تحتاج تطوير 1"]
  },
  "steps": [
    { "order": 1, "title": "عنوان الخطوة", "description": "الوصف بالتفصيل", "duration": "المدة المتوقعة" }
  ],
  "costBreakdown": {
    "total": "التكلفة الإجمالية بالدولار",
    "items": [
      { "category": "الفئة (مثل: رسوم الجامعة)", "amount": "المبلغ بالدولار", "notes": "ملاحظة" }
    ]
  },
  "timeline": [
    { "month": "الشهر 1-3", "milestone": "ما يجب إنجازه" }
  ],
  "recommendedOpportunityIds": [1, 2, 3],
  "tips": ["نصيحة شخصية 1", "نصيحة شخصية 2"],
  "warnings": ["تحذير مهم إن وجد"]
}

اجعل عدد الخطوات بين 5-8، وعدد بنود التكلفة 4-7، وعدد بنود الجدول الزمني 4-6.
استخدم recommendedOpportunityIds من قائمة الفرص المتاحة المرفقة فقط (إن وجدت)، اختر أنسب 3-5 فرص.
كن واقعياً وصريحاً ومحدداً، استخدم بيانات المستخدم في الصياغة.`;

router.post("/plan", async (req, res) => {
  const body = parsePlanRequest(req.body);
  if (!body) {
    res.status(400).json({ error: "بيانات غير صالحة. الحقول المطلوبة: targetCountry, educationLevel, languageLevel, budget" });
    return;
  }

  const country = await db
    .select()
    .from(countriesTable)
    .where(
      or(
        eq(countriesTable.code, body.targetCountry.toUpperCase()),
        sql`lower(${countriesTable.name}) = lower(${body.targetCountry})`,
        eq(countriesTable.nameAr, body.targetCountry),
      ),
    )
    .limit(1);

  const countryRow = country[0];
  const countryCode = countryRow?.code;

  let opportunities: Array<{
    id: number;
    titleAr: string;
    type: string;
    organization: string;
    funding: string;
    degreeLevel: string;
  }> = [];

  if (countryCode) {
    const opps = await db
      .select({
        id: opportunitiesTable.id,
        titleAr: opportunitiesTable.titleAr,
        type: opportunitiesTable.type,
        organization: opportunitiesTable.organization,
        funding: opportunitiesTable.funding,
        degreeLevel: opportunitiesTable.degreeLevel,
      })
      .from(opportunitiesTable)
      .where(and(eq(opportunitiesTable.countryCode, countryCode)))
      .limit(20);
    opportunities = opps;
  }

  const opportunitiesContext =
    opportunities.length > 0
      ? `\n\nالفرص المتاحة في الدولة المستهدفة (استخدم IDs الفعلية فقط):\n${opportunities
          .map(
            (o) =>
              `- ID ${o.id}: ${o.titleAr} (${o.type === "scholarship" ? "منحة" : "هجرة"}) — ${o.organization} — ${o.funding} — ${o.degreeLevel}`,
          )
          .join("\n")}`
      : "";

  const userPrompt = `بيانات المستخدم:
- الدولة المستهدفة: ${body.targetCountry}${countryRow ? ` (${countryRow.nameAr})` : ""}
- الدولة الحالية: ${body.currentCountry ?? "غير محدد"}
- المؤهل الدراسي الحالي: ${body.educationLevel}
- مستوى اللغة: ${body.languageLevel}
- الميزانية المتاحة: ${body.budget}
- الهدف: ${body.goal ?? "غير محدد"}
- التخصص أو المجال: ${body.fieldOfStudy ?? "غير محدد"}
- العمر: ${body.age ?? "غير محدد"}
- الخبرة العملية: ${body.experience ?? "غير محدد"}${opportunitiesContext}

أنشئ خطة سفر ذكية مخصصة وواقعية لهذا المستخدم بصيغة JSON الصالحة فقط حسب التنسيق المطلوب.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 4096,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: PLAN_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let plan;
    try {
      plan = JSON.parse(raw);
    } catch {
      res.status(500).json({ error: "فشل تحليل الخطة" });
      return;
    }

    const validIds = new Set(opportunities.map((o) => o.id));
    const recommendedIds: number[] = Array.isArray(plan.recommendedOpportunityIds)
      ? plan.recommendedOpportunityIds.filter((id: unknown): id is number => typeof id === "number" && validIds.has(id))
      : [];

    const recommendedOpportunities = opportunities
      .filter((o) => recommendedIds.includes(o.id))
      .slice(0, 5);

    res.json({
      ...plan,
      recommendedOpportunityIds: recommendedIds,
      recommendedOpportunities,
      country: countryRow
        ? { code: countryRow.code, name: countryRow.name, nameAr: countryRow.nameAr, flag: countryRow.flag }
        : null,
    });
  } catch (err) {
    req.log.error({ err }, "Plan generation failed");
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errMsg });
  }
});

export default router;
