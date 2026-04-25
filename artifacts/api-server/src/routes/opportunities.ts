import { Router, type IRouter } from "express";
import { db, opportunitiesTable } from "@workspace/db";
import {
  ListOpportunitiesQueryParams,
  GetOpportunityParams,
  ListRecommendedOpportunitiesQueryParams,
} from "@workspace/api-zod";
import { and, asc, desc, eq, ilike, or, sql, gt } from "drizzle-orm";

const router: IRouter = Router();

router.get("/opportunities", async (req, res) => {
  const params = ListOpportunitiesQueryParams.parse(req.query);
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;

  const conditions = [];
  if (params.q) {
    conditions.push(
      or(
        ilike(opportunitiesTable.title, `%${params.q}%`),
        ilike(opportunitiesTable.titleAr, `%${params.q}%`),
        ilike(opportunitiesTable.organization, `%${params.q}%`),
        ilike(opportunitiesTable.field, `%${params.q}%`),
        ilike(opportunitiesTable.countryName, `%${params.q}%`),
        ilike(opportunitiesTable.countryNameAr, `%${params.q}%`),
      ),
    );
  }
  if (params.type && params.type !== "all") {
    conditions.push(eq(opportunitiesTable.type, params.type));
  }
  if (params.countryCode) {
    conditions.push(eq(opportunitiesTable.countryCode, params.countryCode));
  }
  if (params.field) {
    conditions.push(ilike(opportunitiesTable.field, `%${params.field}%`));
  }
  if (params.degreeLevel) {
    conditions.push(eq(opportunitiesTable.degreeLevel, params.degreeLevel));
  }
  if (params.funding) {
    conditions.push(eq(opportunitiesTable.funding, params.funding));
  }
  if (params.featured !== undefined) {
    conditions.push(eq(opportunitiesTable.featured, params.featured));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  let orderBy;
  switch (params.sort) {
    case "deadline":
      orderBy = asc(opportunitiesTable.deadline);
      break;
    case "newest":
      orderBy = desc(opportunitiesTable.createdAt);
      break;
    case "popular":
      orderBy = desc(opportunitiesTable.acceptanceRate);
      break;
    default:
      orderBy = desc(opportunitiesTable.featured);
  }

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(opportunitiesTable)
      .where(where)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(opportunitiesTable)
      .where(where),
  ]);

  res.json({
    items: items.map(serialize),
    total: totalRow[0]?.count ?? 0,
    page,
    pageSize,
  });
});

router.get("/opportunities/featured", async (_req, res) => {
  const items = await db
    .select()
    .from(opportunitiesTable)
    .where(eq(opportunitiesTable.featured, true))
    .orderBy(asc(opportunitiesTable.deadline))
    .limit(12);
  res.json(items.map(serialize));
});

router.get("/opportunities/recommended", async (req, res) => {
  const params = ListRecommendedOpportunitiesQueryParams.parse(req.query);
  const interests = params.interests?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  if (interests.length > 0) {
    const conds = interests.map((i) =>
      or(
        ilike(opportunitiesTable.field, `%${i}%`),
        sql`${opportunitiesTable.tags}::text ilike ${"%" + i + "%"}`,
      ),
    );
    const items = await db
      .select()
      .from(opportunitiesTable)
      .where(or(...conds))
      .orderBy(desc(opportunitiesTable.featured), asc(opportunitiesTable.deadline))
      .limit(12);
    res.json(items.map(serialize));
    return;
  }

  const items = await db
    .select()
    .from(opportunitiesTable)
    .orderBy(desc(opportunitiesTable.featured), desc(opportunitiesTable.acceptanceRate))
    .limit(12);
  res.json(items.map(serialize));
});

router.get("/opportunities/deadlines", async (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const items = await db
    .select()
    .from(opportunitiesTable)
    .where(gt(opportunitiesTable.deadline, today))
    .orderBy(asc(opportunitiesTable.deadline))
    .limit(20);
  res.json(items.map(serialize));
});

router.get("/opportunities/:id", async (req, res) => {
  const { id } = GetOpportunityParams.parse({ id: Number(req.params["id"]) });
  const [item] = await db
    .select()
    .from(opportunitiesTable)
    .where(eq(opportunitiesTable.id, id));

  if (!item) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(serialize(item));
});

function serialize(o: typeof opportunitiesTable.$inferSelect) {
  return {
    id: o.id,
    title: o.title,
    titleAr: o.titleAr,
    type: o.type,
    countryCode: o.countryCode,
    countryName: o.countryName,
    countryNameAr: o.countryNameAr,
    organization: o.organization,
    degreeLevel: o.degreeLevel,
    field: o.field,
    funding: o.funding,
    amount: o.amount ?? undefined,
    duration: o.duration ?? undefined,
    deadline: o.deadline,
    description: o.description,
    eligibility: o.eligibility ?? undefined,
    benefits: o.benefits ?? [],
    requirements: o.requirements ?? [],
    applicationUrl: o.applicationUrl ?? undefined,
    tags: o.tags ?? [],
    difficulty: o.difficulty ?? undefined,
    acceptanceRate: o.acceptanceRate ?? undefined,
    featured: o.featured,
    affiliateUrl: o.affiliateUrl ?? undefined,
    createdAt: o.createdAt.toISOString(),
  };
}

export default router;
