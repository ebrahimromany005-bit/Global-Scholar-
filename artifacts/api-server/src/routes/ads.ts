import { Router, type IRouter } from "express";
import { db, adEventsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { TrackAdEventBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/ads/track", async (req, res) => {
  const body = TrackAdEventBody.parse(req.body);
  await db.insert(adEventsTable).values({ slot: body.slot, event: body.event });
  res.json({ ok: true });
});

router.get("/ads/stats", async (_req, res) => {
  const rows = await db
    .select({
      slot: adEventsTable.slot,
      impressions: sql<number>`count(*) filter (where ${adEventsTable.event} = 'impression')::int`,
      clicks: sql<number>`count(*) filter (where ${adEventsTable.event} = 'click')::int`,
    })
    .from(adEventsTable)
    .groupBy(adEventsTable.slot);

  res.json(
    rows.map((r) => ({
      slot: r.slot,
      impressions: Number(r.impressions ?? 0),
      clicks: Number(r.clicks ?? 0),
    })),
  );
});

export default router;
