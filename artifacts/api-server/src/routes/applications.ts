import { Router, type IRouter } from "express";
import { db, applicationsTable, opportunitiesTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import {
  ListApplicationsQueryParams,
  CreateApplicationBody,
  UpdateApplicationParams,
  UpdateApplicationBody,
  DeleteApplicationParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/applications", async (req, res) => {
  const params = ListApplicationsQueryParams.parse(req.query);

  const rows = await db
    .select({
      id: applicationsTable.id,
      userId: applicationsTable.userId,
      opportunityId: applicationsTable.opportunityId,
      status: applicationsTable.status,
      notes: applicationsTable.notes,
      createdAt: applicationsTable.createdAt,
      updatedAt: applicationsTable.updatedAt,
      opportunityTitle: opportunitiesTable.title,
      opportunityTitleAr: opportunitiesTable.titleAr,
      countryCode: opportunitiesTable.countryCode,
      countryName: opportunitiesTable.countryName,
      countryNameAr: opportunitiesTable.countryNameAr,
      type: opportunitiesTable.type,
      deadline: opportunitiesTable.deadline,
    })
    .from(applicationsTable)
    .innerJoin(
      opportunitiesTable,
      eq(applicationsTable.opportunityId, opportunitiesTable.id),
    )
    .where(eq(applicationsTable.userId, params.userId));

  res.json(
    rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      opportunityId: r.opportunityId,
      opportunityTitle: r.opportunityTitle,
      opportunityTitleAr: r.opportunityTitleAr,
      countryCode: r.countryCode,
      countryName: r.countryName,
      countryNameAr: r.countryNameAr,
      type: r.type,
      status: r.status,
      notes: r.notes ?? undefined,
      deadline: r.deadline,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
  );
});

router.post("/applications", async (req, res) => {
  const body = CreateApplicationBody.parse(req.body);

  const [created] = await db
    .insert(applicationsTable)
    .values({
      userId: body.userId,
      opportunityId: body.opportunityId,
      status: body.status ?? "planning",
      notes: body.notes,
    })
    .returning();

  if (!created) {
    res.status(500).json({ error: "Failed to create application" });
    return;
  }

  const [opp] = await db
    .select()
    .from(opportunitiesTable)
    .where(eq(opportunitiesTable.id, created.opportunityId));

  res.status(201).json({
    id: created.id,
    userId: created.userId,
    opportunityId: created.opportunityId,
    opportunityTitle: opp?.title ?? "",
    opportunityTitleAr: opp?.titleAr ?? "",
    countryCode: opp?.countryCode ?? "",
    countryName: opp?.countryName ?? "",
    countryNameAr: opp?.countryNameAr ?? "",
    type: opp?.type ?? "scholarship",
    status: created.status,
    notes: created.notes ?? undefined,
    deadline: opp?.deadline,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
});

router.patch("/applications/:id", async (req, res) => {
  const { id } = UpdateApplicationParams.parse({ id: Number(req.params["id"]) });
  const body = UpdateApplicationBody.parse(req.body);

  const updateData: { status?: string; notes?: string; updatedAt: Date } = {
    updatedAt: new Date(),
  };
  if (body.status !== undefined) updateData.status = body.status;
  if (body.notes !== undefined) updateData.notes = body.notes;

  const [updated] = await db
    .update(applicationsTable)
    .set(updateData)
    .where(eq(applicationsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const [opp] = await db
    .select()
    .from(opportunitiesTable)
    .where(eq(opportunitiesTable.id, updated.opportunityId));

  res.json({
    id: updated.id,
    userId: updated.userId,
    opportunityId: updated.opportunityId,
    opportunityTitle: opp?.title ?? "",
    opportunityTitleAr: opp?.titleAr ?? "",
    countryCode: opp?.countryCode ?? "",
    countryName: opp?.countryName ?? "",
    countryNameAr: opp?.countryNameAr ?? "",
    type: opp?.type ?? "scholarship",
    status: updated.status,
    notes: updated.notes ?? undefined,
    deadline: opp?.deadline,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
});

router.delete("/applications/:id", async (req, res) => {
  const { id } = DeleteApplicationParams.parse({ id: Number(req.params["id"]) });
  await db.delete(applicationsTable).where(eq(applicationsTable.id, id));
  res.status(204).send();
});

export default router;
