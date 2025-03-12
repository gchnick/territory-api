-- CreateTable
CREATE TABLE "Congregations" (
    "congregation_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "circuit" TEXT NOT NULL,
    "number_of_territories" INTEGER DEFAULT 0,
    "map_image_url" TEXT,
    "north_limit" TEXT NOT NULL,
    "south_limit" TEXT NOT NULL,
    "east_limit" TEXT NOT NULL,
    "west_limit" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Territories" (
    "territory_id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "sector" TEXT,
    "quantity_houses" INTEGER NOT NULL DEFAULT 0,
    "locality" TEXT NOT NULL,
    "locality_in_part" TEXT,
    "map_image_url" TEXT,
    "last_date_completed" DATETIME NOT NULL,
    "current_assigned" BOOLEAN NOT NULL DEFAULT false,
    "congregation_id" INTEGER NOT NULL,

    PRIMARY KEY ("congregation_id", "number"),
    CONSTRAINT "Territories_congregation_id_fkey" FOREIGN KEY ("congregation_id") REFERENCES "Congregations" ("congregation_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MeetingPlaces" (
    "meeting_place_id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,
    "territory_id" TEXT NOT NULL,
    "publisher_id" TEXT,
    CONSTRAINT "MeetingPlaces_territory_id_fkey" FOREIGN KEY ("territory_id") REFERENCES "Territories" ("territory_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MeetingPlaces_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers" ("publisher_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Publishers" (
    "publisher_id" TEXT NOT NULL PRIMARY KEY
);

-- CreateIndex
CREATE UNIQUE INDEX "Congregations_name_key" ON "Congregations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Territories_territory_id_key" ON "Territories"("territory_id");

-- CreateIndex
CREATE UNIQUE INDEX "Territories_label_key" ON "Territories"("label");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingPlaces_publisher_id_key" ON "MeetingPlaces"("publisher_id");
