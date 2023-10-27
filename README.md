# 🗺 Territory API Rest

This ia a backend that serves as the basis for developing an application for territory servant records.

## Comming soon

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

**To npm**

```
npm run build
```

**To yarn**

```
yarn build
```

### 3. Copy the dist folder

Copy the dist folder created in your personal path. Now work into this folder.

### 4. Create a `.env` file

Into write the `DATABASE_URL` to _SQLITE_ database and `PORT` to run the _server_.

```txt
DATABASE_URL="file:./territory.db"
PORT=8000
```

### 5. Install dependencies

Run following command:

To npm

```
npm install --production
```

To yarn

```
yarn install --production=true
```

## 6. Create database

To create the database files of `SQLITE` following command:

**To npm**

```
npm run generate-db
```

**To yarn**

```
yarn generate-db
```

### 6. Run server

Run following command:

**To npm**

```
npm run start
```

**To yarn**

```
yarn start
```

## How update database

If there have been updates to the database you can apply them one by one by writing the following command:

```
npx prisma migrate resolve --applied "MIGRATION_NAME"
```
