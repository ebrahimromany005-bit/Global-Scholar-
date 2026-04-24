import { Router, type IRouter } from "express";
import { db, opportunitiesTable, countriesTable } from "@workspace/db";
import { sql, gt, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats/overview", async (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  const [counts] = await db
    .select({
      totalOpportunities: sql<number>`count(*)::int`,
      totalScholarships: sql<number>`count(*) filter (where ${opportunitiesTable.type} = 'scholarship')::int`,
      totalMigration: sql<number>`count(*) filter (where ${opportunitiesTable.type} = 'migration')::int`,
      featuredCount: sql<number>`count(*) filter (where ${opportunitiesTable.featured} = true)::int`,
    })
    .from(opportunitiesTable);

  const [{ countryCount }] = await db
    .select({ countryCount: sql<number>`count(*)::int` })
    .from(countriesTable);

  const [{ deadlines }] = await db
    .select({ deadlines: sql<number>`count(*)::int` })
    .from(opportunitiesTable)
    .where(gt(opportunitiesTable.deadline, today));

  res.json({
    totalOpportunities: Number(counts?.totalOpportunities ?? 0),
    totalScholarships: Number(counts?.totalScholarships ?? 0),
    totalMigration: Number(counts?.totalMigration ?? 0),
    totalCountries: Number(countryCount ?? 0),
    upcomingDeadlines: Number(deadlines ?? 0),
    featuredCount: Number(counts?.featuredCount ?? 0),
  });
});

router.get("/stats/by-type", async (_req, res) => {
  const rows = await db
    .select({
      type: opportunitiesTable.type,
      count: sql<number>`count(*)::int`,
    })
    .from(opportunitiesTable)
    .groupBy(opportunitiesTable.type);
  res.json(rows.map((r) => ({ type: r.type, count: Number(r.count) })));
});

router.get("/stats/top-countries", async (_req, res) => {
  const rows = await db
    .select({
      countryCode: countriesTable.code,
      countryName: countriesTable.name,
      countryNameAr: countriesTable.nameAr,
      flag: countriesTable.flag,
      count: sql<number>`count(${opportunitiesTable.id})::int`,
    })
    .from(countriesTable)
    .leftJoin(opportunitiesTable, eq(opportunitiesTable.countryCode, countriesTable.code))
    .groupBy(countriesTable.code)
    .orderBy(sql`count(${opportunitiesTable.id}) desc`)
    .limit(20);

  res.json(
    rows.map((r) => ({
      countryCode: r.countryCode,
      countryName: r.countryName,
      countryNameAr: r.countryNameAr,
      flag: r.flag,
      count: Number(r.count ?? 0),
    })),
  );
});

export default router;
