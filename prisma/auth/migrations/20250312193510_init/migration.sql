-- CreateEnum
CREATE TYPE "Hope" AS ENUM ('OTHER_SHEEP', 'ANOINTED');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "AvailabilityType" AS ENUM ('ABSENCE', 'AVAILABLE');

-- CreateTable
CREATE TABLE "Roles" (
    "role_id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Users" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "registry_token" TEXT,
    "publisher_id" UUID NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("publisher_id")
);

-- CreateTable
CREATE TABLE "Publishers" (
    "publisher_id" UUID NOT NULL,
    "is_householder" BOOLEAN NOT NULL DEFAULT false,
    "first_name" VARCHAR(25) NOT NULL,
    "middle_name" VARCHAR(25),
    "fathers_surname" VARCHAR(25) NOT NULL,
    "mothers_surname" VARCHAR(25),
    "number_portal" VARCHAR(10),
    "sector_address" VARCHAR(25),
    "street_avenue" VARCHAR(100),
    "city_municipality" VARCHAR(50),
    "postal_code" VARCHAR(5),
    "floor_apartment" VARCHAR(10),
    "reference_point" VARCHAR(255),
    "email" TEXT,
    "photo_url" VARCHAR(255),
    "hope" "Hope" NOT NULL DEFAULT 'OTHER_SHEEP',
    "birth_date" DATE NOT NULL,
    "baptism_date" DATE,
    "last_reporter" DATE,
    "last_irregular_without_report" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_removed" BOOLEAN NOT NULL DEFAULT false,
    "family_group_id" INTEGER,
    "service_group_id" INTEGER,
    "emergency_contact_id" INTEGER,

    CONSTRAINT "Publishers_pkey" PRIMARY KEY ("publisher_id")
);

-- CreateTable
CREATE TABLE "Privileges" (
    "privileges_id" SERIAL NOT NULL,
    "type" VARCHAR(19) NOT NULL,
    "code" TEXT,
    "init_date" DATE,

    CONSTRAINT "Privileges_pkey" PRIMARY KEY ("privileges_id")
);

-- CreateTable
CREATE TABLE "PrivilegesOfPublisher" (
    "publisher_id" UUID NOT NULL,
    "privilege_id" INTEGER NOT NULL,

    CONSTRAINT "PrivilegesOfPublisher_pkey" PRIMARY KEY ("publisher_id","privilege_id")
);

-- CreateTable
CREATE TABLE "FamilyGroups" (
    "family_group_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "FamilyGroups_pkey" PRIMARY KEY ("family_group_id")
);

-- CreateTable
CREATE TABLE "ServiceGroups" (
    "service_group_id" SERIAL NOT NULL,
    "manager" UUID NOT NULL,
    "assistant" UUID NOT NULL,

    CONSTRAINT "ServiceGroups_pkey" PRIMARY KEY ("service_group_id")
);

-- CreateTable
CREATE TABLE "EmergencyContacts" (
    "emergency_contact_id" SERIAL NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(7) NOT NULL,
    "relationship" VARCHAR(50) NOT NULL,

    CONSTRAINT "EmergencyContacts_pkey" PRIMARY KEY ("emergency_contact_id")
);

-- CreateTable
CREATE TABLE "Phones" (
    "phone_id" SERIAL NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "has_whatsapp" BOOLEAN NOT NULL DEFAULT false,
    "phone" VARCHAR(7) NOT NULL,

    CONSTRAINT "Phones_pkey" PRIMARY KEY ("phone_id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "availability_id" SERIAL NOT NULL,
    "start_date" TIMESTAMPTZ,
    "finish_date" TIMESTAMPTZ,
    "frequency" "Frequency" DEFAULT 'DAILY',
    "days_of_week" "DayOfWeek"[],
    "notes" VARCHAR(255),
    "publisher_id" UUID NOT NULL,
    "availability_type_id" INTEGER NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("availability_id")
);

-- CreateTable
CREATE TABLE "AvailabilityTypes" (
    "availability_type_id" SERIAL NOT NULL,
    "type" "AvailabilityType" NOT NULL DEFAULT 'AVAILABLE',
    "name" VARCHAR(20) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "AvailabilityTypes_pkey" PRIMARY KEY ("availability_type_id")
);

-- CreateTable
CREATE TABLE "_RoleOfUser" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_RoleOfUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PhoneOfPublisher" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_PhoneOfPublisher_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_role_key" ON "Roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_publisher_id_key" ON "Users"("publisher_id");

-- CreateIndex
CREATE UNIQUE INDEX "Publishers_email_key" ON "Publishers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Privileges_type_key" ON "Privileges"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Privileges_code_key" ON "Privileges"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceGroups_manager_assistant_key" ON "ServiceGroups"("manager", "assistant");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContacts_phone_key" ON "EmergencyContacts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Phones_phone_key" ON "Phones"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilityTypes_name_key" ON "AvailabilityTypes"("name");

-- CreateIndex
CREATE INDEX "_RoleOfUser_B_index" ON "_RoleOfUser"("B");

-- CreateIndex
CREATE INDEX "_PhoneOfPublisher_B_index" ON "_PhoneOfPublisher"("B");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers"("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publishers" ADD CONSTRAINT "Publishers_family_group_id_fkey" FOREIGN KEY ("family_group_id") REFERENCES "FamilyGroups"("family_group_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publishers" ADD CONSTRAINT "Publishers_service_group_id_fkey" FOREIGN KEY ("service_group_id") REFERENCES "ServiceGroups"("service_group_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publishers" ADD CONSTRAINT "Publishers_emergency_contact_id_fkey" FOREIGN KEY ("emergency_contact_id") REFERENCES "EmergencyContacts"("emergency_contact_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivilegesOfPublisher" ADD CONSTRAINT "PrivilegesOfPublisher_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers"("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivilegesOfPublisher" ADD CONSTRAINT "PrivilegesOfPublisher_privilege_id_fkey" FOREIGN KEY ("privilege_id") REFERENCES "Privileges"("privileges_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publishers"("publisher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_availability_type_id_fkey" FOREIGN KEY ("availability_type_id") REFERENCES "AvailabilityTypes"("availability_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleOfUser" ADD CONSTRAINT "_RoleOfUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleOfUser" ADD CONSTRAINT "_RoleOfUser_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("publisher_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhoneOfPublisher" ADD CONSTRAINT "_PhoneOfPublisher_A_fkey" FOREIGN KEY ("A") REFERENCES "Phones"("phone_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhoneOfPublisher" ADD CONSTRAINT "_PhoneOfPublisher_B_fkey" FOREIGN KEY ("B") REFERENCES "Publishers"("publisher_id") ON DELETE CASCADE ON UPDATE CASCADE;
