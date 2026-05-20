import { Router, type IRouter, type Request, type Response } from "express";
import { db, opportunitiesTable } from "@workspace/db";
import { eq, lt, and, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/cron/renew-scholarships", async (req: Request, res: Response) => {
  const secret = process.env["CRON_SECRET"];

  if (!secret) {
    res.status(500).json({ error: "CRON_SECRET not configured on server" });
    return;
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const today = new Date().toISOString().split("T")[0]!;

    const expired = await db
      .select({ id: opportunitiesTable.id, deadline: opportunitiesTable.deadline })
      .from(opportunitiesTable)
      .where(
        and(
          eq(opportunitiesTable.type, "scholarship"),
          lt(opportunitiesTable.deadline, today),
        ),
      );

    if (expired.length === 0) {
      res.json({ renewed: 0, message: "No expired scholarships found" });
      return;
    }

    let renewed = 0;

    for (const opp of expired) {
      const current = new Date(opp.deadline);
      const newDeadline = new Date(current);

      newDeadline.setFullYear(newDeadline.getFullYear() + 1);

      const newDeadlineStr = newDeadline.toISOString().split("T")[0]!;

      await db
        .update(opportunitiesTable)
        .set({ deadline: newDeadlineStr })
        .where(eq(opportunitiesTable.id, opp.id));

      renewed++;
    }

    req.log.info({ renewed, total: expired.length }, "Cron: scholarships renewed");

    res.json({
      success: true,
      renewed,
      message: `Renewed ${renewed} expired scholarship deadlines by 1 year`,
      ranAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Cron: failed to renew scholarships");
    res.status(500).json({ error: "Internal server error during cron job" });
  }
});

export default router;
