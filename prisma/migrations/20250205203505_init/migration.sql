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
    "place" TEXT NOT NULL,
    "mobile_phone" TEXT,
    "field_service" BOOLEAN NOT NULL DEFAULT false,
    "latitude" TEXT,
    "longitude" TEXT,
    "territory_id" TEXT NOT NULL,
    CONSTRAINT "MeetingPlaces_territory_id_fkey" FOREIGN KEY ("territory_id") REFERENCES "Territories" ("territory_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MeetingPlaceAvailability" (
    "day" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "moment" TEXT NOT NULL,
    "meeting_place_id" TEXT NOT NULL,

    PRIMARY KEY ("meeting_place_id", "day"),
    CONSTRAINT "MeetingPlaceAvailability_meeting_place_id_fkey" FOREIGN KEY ("meeting_place_id") REFERENCES "MeetingPlaces" ("meeting_place_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Periods" (
    "period_id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "finish_date" DATETIME
);

-- CreateTable
CREATE TABLE "Registries" (
    "registry_id" TEXT NOT NULL PRIMARY KEY,
    "date_assigned" DATETIME NOT NULL,
    "date_completed" DATETIME,
    "conductor_id" TEXT NOT NULL,
    "territory_id" TEXT NOT NULL,
    "period_id" TEXT NOT NULL,
    CONSTRAINT "Registries_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "Conductors" ("conductor_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Registries_territory_id_fkey" FOREIGN KEY ("territory_id") REFERENCES "Territories" ("territory_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Registries_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "Periods" ("period_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FamilyGroups" (
    "family_group_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Phones" (
    "phone_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "number" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Roles" (
    "role_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Users" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "publisher_id" TEXT,
    CONSTRAINT "Users_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers" ("publisher_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Publishers" (
    "publisher_id" TEXT NOT NULL PRIMARY KEY,
    "householder" BOOLEAN NOT NULL DEFAULT false,
    "sort_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "address" TEXT,
    "mobile_phone" TEXT,
    "service_group" INTEGER NOT NULL DEFAULT -1,
    "photo_url" TEXT,
    "privileges" TEXT NOT NULL,
    "hope" TEXT NOT NULL,
    "last_report" DATETIME,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_aparted" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "family_group_id" INTEGER NOT NULL,
    CONSTRAINT "Publishers_family_group_id_fkey" FOREIGN KEY ("family_group_id") REFERENCES "FamilyGroups" ("family_group_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmergencyContacts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "EmergencyContacts_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Elders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "Elders_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MinisterialServants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "MinisterialServants_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pioneers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "Pioneers_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Missionaries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "Missionaries_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conductors" (
    "conductor_id" TEXT NOT NULL PRIMARY KEY,
    "last_date_assigned" DATETIME,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "Conductors_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers" ("publisher_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConductorAvailability" (
    "day" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "moment" TEXT NOT NULL,
    "conductor_id" TEXT NOT NULL,

    PRIMARY KEY ("conductor_id", "day"),
    CONSTRAINT "ConductorAvailability_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "Conductors" ("conductor_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Programs" (
    "program_id" TEXT NOT NULL PRIMARY KEY,
    "since_week" DATETIME NOT NULL,
    "until_week" DATETIME NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Assignaments" (
    "assignament_id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "covered" BOOLEAN NOT NULL DEFAULT false,
    "meeting_place_id" TEXT NOT NULL,
    "conductor_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    CONSTRAINT "Assignaments_meeting_place_id_fkey" FOREIGN KEY ("meeting_place_id") REFERENCES "MeetingPlaces" ("meeting_place_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Assignaments_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "Conductors" ("conductor_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Assignaments_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Programs" ("program_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonthsYearService" (
    "month_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ReportsCurrentFile" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participated_in_some_facet" BOOLEAN NOT NULL DEFAULT false,
    "hours" DECIMAL,
    "bible_courses" INTEGER,
    "is_pioneer" BOOLEAN NOT NULL DEFAULT false,
    "is_auxiliary_pioneer" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "months_year_service_id" INTEGER NOT NULL,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "ReportsCurrentFile_months_year_service_id_fkey" FOREIGN KEY ("months_year_service_id") REFERENCES "MonthsYearService" ("month_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReportsCurrentFile_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeadFile" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participated_in_some_facet" BOOLEAN NOT NULL DEFAULT false,
    "hours" DECIMAL,
    "bible_courses" INTEGER,
    "is_pioneer" BOOLEAN NOT NULL DEFAULT false,
    "is_auxiliary_pioneer" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "months_year_service_id" INTEGER NOT NULL,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "DeadFile_months_year_service_id_fkey" FOREIGN KEY ("months_year_service_id") REFERENCES "MonthsYearService" ("month_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DeadFile_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TotalPublisherReports" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_publishers" INTEGER NOT NULL,
    "total_publisher_reports" INTEGER NOT NULL,
    "month_id" INTEGER NOT NULL,
    CONSTRAINT "TotalPublisherReports_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "MonthsYearService" ("month_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TotalPioneerReports" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_publishers" INTEGER NOT NULL,
    "total_publisher_reports" INTEGER NOT NULL,
    "month_id" INTEGER NOT NULL,
    CONSTRAINT "TotalPioneerReports_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "MonthsYearService" ("month_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TotalAuxiliaryPioneersReports" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_pioneers" INTEGER NOT NULL,
    "total_pioneer_reports" INTEGER NOT NULL,
    "month_id" INTEGER NOT NULL,
    CONSTRAINT "TotalAuxiliaryPioneersReports_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "MonthsYearService" ("month_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PhoneOfPublisher" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PhoneOfPublisher_A_fkey" FOREIGN KEY ("A") REFERENCES "Phones" ("phone_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PhoneOfPublisher_B_fkey" FOREIGN KEY ("B") REFERENCES "Publishers" ("publisher_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RoleOfUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RoleOfUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Roles" ("role_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RoleOfUser_B_fkey" FOREIGN KEY ("B") REFERENCES "Users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Congregations_name_key" ON "Congregations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Territories_territory_id_key" ON "Territories"("territory_id");

-- CreateIndex
CREATE UNIQUE INDEX "Territories_label_key" ON "Territories"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Phones_number_key" ON "Phones"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_role_key" ON "Roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_publisher_id_key" ON "Users"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "Publishers_sort_name_key" ON "Publishers"("sort_name");

-- CreateIndex
CREATE UNIQUE INDEX "Publishers_mobile_phone_key" ON "Publishers"("mobile_phone");

-- CreateIndex
CREATE UNIQUE INDEX "Publishers_email_key" ON "Publishers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Publishers_first_name_last_name_key" ON "Publishers"("first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContacts_phone_key" ON "EmergencyContacts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContacts_publisher_id_key" ON "EmergencyContacts"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "Elders_publisher_id_key" ON "Elders"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "MinisterialServants_publisher_id_key" ON "MinisterialServants"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "Pioneers_publisher_id_key" ON "Pioneers"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "Missionaries_publisher_id_key" ON "Missionaries"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "_PhoneOfPublisher_AB_unique" ON "_PhoneOfPublisher"("A", "B");

-- CreateIndex
CREATE INDEX "_PhoneOfPublisher_B_index" ON "_PhoneOfPublisher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleOfUser_AB_unique" ON "_RoleOfUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleOfUser_B_index" ON "_RoleOfUser"("B");
