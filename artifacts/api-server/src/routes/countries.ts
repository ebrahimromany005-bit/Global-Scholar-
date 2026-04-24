import { Router, type IRouter } from "express";
import { db, countriesTable, opportunitiesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { GetCountryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/countries", async (_req, res) => {
  const rows = await db
    .select({
      code: countriesTable.code,
      name: countriesTable.name,
      nameAr: countriesTable.nameAr,
      flag: countriesTable.flag,
      region: countriesTable.region,
      latitude: countriesTable.latitude,
      longitude: countriesTable.longitude,
      opportunityCount: sql<number>`count(${opportunitiesTable.id})::int`,
      scholarshipCount: sql<number>`count(${opportunitiesTable.id}) filter (where ${opportunitiesTable.type} = 'scholarship')::int`,
      migrationCount: sql<number>`count(${opportunitiesTable.id}) filter (where ${opportunitiesTable.type} = 'migration')::int`,
    })
    .from(countriesTable)
    .leftJoin(opportunitiesTable, eq(opportunitiesTable.countryCode, countriesTable.code))
    .groupBy(countriesTable.code);

  res.json(
    rows.map((r) => ({
      code: r.code,
      name: r.name,
      nameAr: r.nameAr,
      flag: r.flag,
      region: r.region,
      opportunityCount: Number(r.opportunityCount ?? 0),
      scholarshipCount: Number(r.scholarshipCount ?? 0),
      migrationCount: Number(r.migrationCount ?? 0),
      latitude: r.latitude ?? undefined,
      longitude: r.longitude ?? undefined,
    })),
  );
});

router.get("/countries/:code", async (req, res) => {
  const { code } = GetCountryParams.parse({ code: req.params["code"] });

  const [country] = await db
    .select()
    .from(countriesTable)
    .where(eq(countriesTable.code, code));

  if (!country) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const opps = await db
    .select()
    .from(opportunitiesTable)
    .where(eq(opportunitiesTable.countryCode, code));

  const scholarshipCount = opps.filter((o) => o.type === "scholarship").length;
  const migrationCount = opps.filter((o) => o.type === "migration").length;

  res.json({
    code: country.code,
    name: country.name,
    nameAr: country.nameAr,
    flag: country.flag,
    region: country.region,
    description: country.description ?? "",
    opportunityCount: opps.length,
    scholarshipCount,
    migrationCount,
    opportunities: opps.map((o) => ({
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
    })),
  });
});

export default router;
