-- CreateTable
CREATE TABLE "territories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "north_limit" TEXT NOT NULL,
    "south_limit" TEXT NOT NULL,
    "east_limit" TEXT NOT NULL,
    "west_limit" TEXT NOT NULL,
    "url_map_image" TEXT,
    "last_date_completed" DATETIME NOT NULL,
    "assigned_lock" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "meeting_places" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "place" TEXT NOT NULL,
    "phone" TEXT,
    "field_service" BOOLEAN NOT NULL DEFAULT false,
    "latitude" TEXT,
    "longitude" TEXT,
    "territory_id" TEXT NOT NULL,
    CONSTRAINT "meeting_places_territory_id_fkey" FOREIGN KEY ("territory_id") REFERENCES "territories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meeting_place_availability" (
    "day" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "moment" TEXT NOT NULL,
    "meeting_place_id" TEXT NOT NULL,

    PRIMARY KEY ("meeting_place_id", "day"),
    CONSTRAINT "meeting_place_availability_meeting_place_id_fkey" FOREIGN KEY ("meeting_place_id") REFERENCES "meeting_places" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "registry_periods" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "finish_date" DATETIME
);

-- CreateTable
CREATE TABLE "registries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assigned_date" DATETIME NOT NULL,
    "completion_date" DATETIME,
    "conductor_id" TEXT NOT NULL,
    "territory_id" TEXT NOT NULL,
    "registry_period_id" TEXT NOT NULL,
    CONSTRAINT "registries_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "conductors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "registries_territory_id_fkey" FOREIGN KEY ("territory_id") REFERENCES "territories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "registries_registry_period_id_fkey" FOREIGN KEY ("registry_period_id") REFERENCES "registry_periods" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "conductors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "mobile_phone" TEXT NOT NULL,
    "service_group" INTEGER NOT NULL,
    "privilege" TEXT NOT NULL,
    "last_date_assigned" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "conductor_availability" (
    "day" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "moment" TEXT NOT NULL,
    "conductor_id" TEXT NOT NULL,

    PRIMARY KEY ("conductor_id", "day"),
    CONSTRAINT "conductor_availability_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "conductors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "since_week" DATETIME NOT NULL,
    "until_week" DATETIME NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "assignaments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "covered" BOOLEAN NOT NULL DEFAULT false,
    "meeting_place_id" TEXT NOT NULL,
    "coductor_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    CONSTRAINT "assignaments_meeting_place_id_fkey" FOREIGN KEY ("meeting_place_id") REFERENCES "meeting_places" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "assignaments_coductor_id_fkey" FOREIGN KEY ("coductor_id") REFERENCES "conductors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "assignaments_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "territories_number_key" ON "territories"("number");

-- CreateIndex
CREATE UNIQUE INDEX "conductors_mobile_phone_key" ON "conductors"("mobile_phone");
