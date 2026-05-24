-- Per-entry unit override (falls back to WorkType.unit when null)
ALTER TABLE "WorkEntry" ADD COLUMN "unit" TEXT;

UPDATE "WorkEntry" e
SET "unit" = wt."unit"
FROM "WorkType" wt
WHERE e."workTypeId" = wt."id";
