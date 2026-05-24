-- CreateTable
CREATE TABLE "WorkType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "WorkType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkType_name_key" ON "WorkType"("name");

-- Seed catalog
INSERT INTO "WorkType" ("name", "unit") VALUES
('Кладка перегородок', 'м³'),
('Монтаж опалубки', 'м²'),
('Армирование', 'т'),
('Бетонирование', 'м³'),
('Земляные работы', 'м³'),
('Монтаж конструкций', 'т'),
('Штукатурные работы', 'м²'),
('Покраска', 'м²'),
('Прочие', 'шт');

-- Link entries to catalog
ALTER TABLE "WorkEntry" ADD COLUMN "workTypeId" INTEGER;

UPDATE "WorkEntry" e
SET "workTypeId" = wt."id"
FROM "WorkType" wt
WHERE e."workName" = wt."name";

UPDATE "WorkEntry"
SET "workTypeId" = (SELECT "id" FROM "WorkType" WHERE "name" = 'Прочие' LIMIT 1)
WHERE "workTypeId" IS NULL;

ALTER TABLE "WorkEntry" ALTER COLUMN "workTypeId" SET NOT NULL;

ALTER TABLE "WorkEntry" ADD CONSTRAINT "WorkEntry_workTypeId_fkey"
  FOREIGN KEY ("workTypeId") REFERENCES "WorkType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "WorkEntry" DROP COLUMN "workName";
ALTER TABLE "WorkEntry" DROP COLUMN "unit";
