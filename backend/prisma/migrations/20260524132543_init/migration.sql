-- CreateTable
CREATE TABLE "WorkEntry" (
    "id" SERIAL NOT NULL,
    "workDate" DATE NOT NULL,
    "workName" TEXT NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "performer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkEntry_pkey" PRIMARY KEY ("id")
);
