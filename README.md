# 🗺 Territory API Rest

This is a backend that serves as the basis for developing an application for territory servant records.

## Coming soon

- Add Swagger documentation Api
- Add end to end test per endpoint
- Add unit test
- Use Domain Driven Design methodology
- Use Port and Adapter Architecture

## Requirements to install

You need to have installed:

- NodeJs

## How install this application in local computer

### 1. Clone the repository

```
git clone https://github.com/gchnick/territory-api.git
```

### 2. Compile the project

Run following command:

```
node --run build
```

### 3. Go to dist folder

Now work into dist folder.

### 4. Config file

Rename the **env.template** file to **.env**

You can change the values ​​of each of the environment variables to suit your needs.

### 5. Install dependencies

Run following command:

```
pnpm install --prod
```

## 6. Deploy databases

### 6.1 Create local database

To create the database files of `SQLITE` following command:

```
node --run prisma:deploy
```

### 6.1 Apply migration to external database

To apply the migration using Turso's CLI:

```
turso db shell turso-prisma.db < ./prisma/external/migrations/20250310214508_init/migration.sql
```

### 6. Run server

Run following command:

```
node --run start
```

## How update database

If there have been updates to the database you can apply them one by one by writing the following command:

```
npx prisma migrate resolve --applied <MIGRATION_NAME>
```

Change `<MIGRATION_NAME>` for the filename of migration respective.
