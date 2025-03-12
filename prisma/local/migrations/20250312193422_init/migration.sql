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
    "territory_id" TEXT NOT NULL,
    "conductor_id" TEXT NOT NULL,
    "period_id" TEXT NOT NULL,
    CONSTRAINT "Registries_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "Conductors" ("conductor_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Registries_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "Periods" ("period_id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "publisher_id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Conductors" (
    "conductor_id" TEXT NOT NULL PRIMARY KEY,
    "last_date_assigned" DATETIME,
    "publisher_id" TEXT NOT NULL,
    CONSTRAINT "Conductors_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers" ("publisher_id") ON DELETE CASCADE ON UPDATE CASCADE
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
    CONSTRAINT "Assignaments_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "Conductors" ("conductor_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Assignaments_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Programs" ("program_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RoleOfUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RoleOfUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Roles" ("role_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RoleOfUser_B_fkey" FOREIGN KEY ("B") REFERENCES "Users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_role_key" ON "Roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_publisher_id_key" ON "Users"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleOfUser_AB_unique" ON "_RoleOfUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleOfUser_B_index" ON "_RoleOfUser"("B");
