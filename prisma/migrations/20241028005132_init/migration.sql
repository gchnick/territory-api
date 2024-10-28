-- CreateTable
CREATE TABLE "congregations" (
    "number" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
CREATE TABLE "territories" (
    "teritory_id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "quantity_houses" INTEGER NOT NULL DEFAULT 0,
    "locality" TEXT NOT NULL,
    "locality_in_part" TEXT,
    "map_image_url" TEXT,
    "last_date_completed" DATETIME NOT NULL,
    "current_assigned" BOOLEAN NOT NULL DEFAULT false,
    "congregation_id" INTEGER NOT NULL,
    CONSTRAINT "territories_congregation_id_fkey" FOREIGN KEY ("congregation_id") REFERENCES "congregations" ("number") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meeting_places" (
    "meeting_place_id" TEXT NOT NULL PRIMARY KEY,
    "place" TEXT NOT NULL,
    "mobile_phone" TEXT,
    "field_service" BOOLEAN NOT NULL DEFAULT false,
    "latitude" TEXT,
    "longitude" TEXT,
    "territory_id" TEXT NOT NULL,
    CONSTRAINT "meeting_places_territory_id_fkey" FOREIGN KEY ("territory_id") REFERENCES "territories" ("teritory_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meeting_place_availability" (
    "day" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "moment" TEXT NOT NULL,
    "meeting_place_id" TEXT NOT NULL,

    PRIMARY KEY ("meeting_place_id", "day"),
    CONSTRAINT "meeting_place_availability_meeting_place_id_fkey" FOREIGN KEY ("meeting_place_id") REFERENCES "meeting_places" ("meeting_place_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "periods" (
    "period_id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "finish_date" DATETIME
);

-- CreateTable
CREATE TABLE "registries" (
    "registry_id" TEXT NOT NULL PRIMARY KEY,
    "date_assigned" DATETIME NOT NULL,
    "date_completed" DATETIME,
    "conductor_id" TEXT NOT NULL,
    "territory_id" TEXT NOT NULL,
    "period_id" TEXT NOT NULL,
    CONSTRAINT "registries_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "conductors" ("conductor_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "registries_territory_id_fkey" FOREIGN KEY ("territory_id") REFERENCES "territories" ("teritory_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "registries_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods" ("period_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "family_groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "phones" (
    "phone_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "number" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "user__role" (
    "user_id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,

    PRIMARY KEY ("user_id", "role_id"),
    CONSTRAINT "user__role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user__role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "publisher_id" TEXT,
    CONSTRAINT "users_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers" ("publisher_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "publishers" (
    "publisher_id" TEXT NOT NULL PRIMARY KEY,
    "householder" BOOLEAN NOT NULL DEFAULT false,
    "sort_name" TEXT NOT NULL,
    "firts_name" TEXT NOT NULL,
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
    CONSTRAINT "publishers_family_group_id_fkey" FOREIGN KEY ("family_group_id") REFERENCES "family_groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "publisher__phone" (
    "publisher_id" TEXT NOT NULL,
    "phone_id" INTEGER NOT NULL,

    PRIMARY KEY ("publisher_id", "phone_id"),
    CONSTRAINT "publisher__phone_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "publisher__phone_phone_id_fkey" FOREIGN KEY ("phone_id") REFERENCES "phones" ("phone_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "emergency_contacts_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "elders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "elders_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ministerial_servants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "ministerial_servants_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pioneers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "pioneers_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "missionaries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "missionaries_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "conductors" (
    "conductor_id" TEXT NOT NULL PRIMARY KEY,
    "last_date_assigned" DATETIME,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "conductors_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers" ("publisher_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "conductor_availability" (
    "day" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "moment" TEXT NOT NULL,
    "conductor_id" TEXT NOT NULL,

    PRIMARY KEY ("conductor_id", "day"),
    CONSTRAINT "conductor_availability_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "conductors" ("conductor_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "programs" (
    "program_id" TEXT NOT NULL PRIMARY KEY,
    "since_week" DATETIME NOT NULL,
    "until_week" DATETIME NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "assignaments" (
    "assignament_id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "covered" BOOLEAN NOT NULL DEFAULT false,
    "meeting_place_id" TEXT NOT NULL,
    "coductor_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    CONSTRAINT "assignaments_meeting_place_id_fkey" FOREIGN KEY ("meeting_place_id") REFERENCES "meeting_places" ("meeting_place_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "assignaments_coductor_id_fkey" FOREIGN KEY ("coductor_id") REFERENCES "conductors" ("conductor_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "assignaments_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs" ("program_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "months_year_service" (
    "month_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "reports_current_file" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participated_in_some_facet" BOOLEAN NOT NULL DEFAULT false,
    "hours" DECIMAL,
    "bible_courses" INTEGER,
    "is_pioneer" BOOLEAN NOT NULL DEFAULT false,
    "is_auxiliar_pioneer" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "months_year_service_id" INTEGER NOT NULL,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "reports_current_file_months_year_service_id_fkey" FOREIGN KEY ("months_year_service_id") REFERENCES "months_year_service" ("month_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reports_current_file_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dead_file" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participated_in_some_facet" BOOLEAN NOT NULL DEFAULT false,
    "hours" DECIMAL,
    "bible_courses" INTEGER,
    "is_pioneer" BOOLEAN NOT NULL DEFAULT false,
    "is_auxiliar_pioneer" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "months_year_service_id" INTEGER NOT NULL,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "dead_file_months_year_service_id_fkey" FOREIGN KEY ("months_year_service_id") REFERENCES "months_year_service" ("month_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "dead_file_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers" ("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "total_publisher_reports" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_publishers" INTEGER NOT NULL,
    "total_publisher_reports" INTEGER NOT NULL,
    "month_id" INTEGER NOT NULL,
    CONSTRAINT "total_publisher_reports_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "months_year_service" ("month_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "total_pioneer_reports" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_publishers" INTEGER NOT NULL,
    "total_publisher_reports" INTEGER NOT NULL,
    "month_id" INTEGER NOT NULL,
    CONSTRAINT "total_pioneer_reports_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "months_year_service" ("month_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "total_auxiliary_pioneers_reports" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_pioneers" INTEGER NOT NULL,
    "total_pioneer_reports" INTEGER NOT NULL,
    "month_id" INTEGER NOT NULL,
    CONSTRAINT "total_auxiliary_pioneers_reports_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "months_year_service" ("month_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "congregations_name_key" ON "congregations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "territories_number_key" ON "territories"("number");

-- CreateIndex
CREATE UNIQUE INDEX "territories_label_key" ON "territories"("label");

-- CreateIndex
CREATE UNIQUE INDEX "phones_number_key" ON "phones"("number");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_key" ON "roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_publisher_id_key" ON "users"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "publishers_sort_name_key" ON "publishers"("sort_name");

-- CreateIndex
CREATE UNIQUE INDEX "publishers_mobile_phone_key" ON "publishers"("mobile_phone");

-- CreateIndex
CREATE UNIQUE INDEX "publishers_email_key" ON "publishers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "publishers_firts_name_last_name_key" ON "publishers"("firts_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_contacts_phone_key" ON "emergency_contacts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_contacts_publisher_id_key" ON "emergency_contacts"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "elders_publisher_id_key" ON "elders"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "ministerial_servants_publisher_id_key" ON "ministerial_servants"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "pioneers_publisher_id_key" ON "pioneers"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "missionaries_publisher_id_key" ON "missionaries"("publisher_id");
