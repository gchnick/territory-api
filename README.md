# 🗺 Territory API Rest

This is a backend that serves as the basis for developing an application for territory servant records.

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

```
yarn build
```

### 3. Go to dist folder

Now work into dist folder.

### 4. Config file

Rename the **env.template** file to **.env**

You can change the values ​​of each of the environment variables to suit your needs.

### 5. Install dependencies

Run following command:

```
yarn install --production=true
```

## 6. Create database

To create the database files of `SQLITE` following command:

```
yarn generate-db
```

### 6. Run server

Run following command:

```
yarn start
```

## How update database

If there have been updates to the database you can apply them one by one by writing the following command:

```
npx prisma migrate resolve --applied "MIGRATION_NAME"
```
