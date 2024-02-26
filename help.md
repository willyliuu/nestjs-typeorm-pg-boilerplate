# Setup Database

0. Setup env

make sure to set env to the system
```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
BCRYPT_SALT=
JWT_SECRET=
```
Notes: by default this app doesn't use dotenv

1. Create migration

Run:
npx typeorm migration:create ./src/migrations/<Migration_Name> (ex: CreateTableUser)

2. Run migrations

Add the migrations reference into array of migrations in ./src/data-source.ts.
```
  const { CreateTableUser2 } = require('./migrations/2-CreateTableUser');

  const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [
      CreateTableUser2,
    ],
  });
```
Run:
npx typeorm-ts-node-esm migration:run -d ./src/data-source.ts

- Note: don't forget to add new migration file into data-source.ts options migrations.

2. Run revert

Run:
npx typeorm-ts-node-esm migration:revert -d ./src/data-source.ts

# Create Controller

0. Create controller file

npx nest g controller <controller_name>s (ex: employees)

1. Setup controller file

- Create Dto folder

Notes: https://docs.nestjs.com/techniques/validation#validation

- Create Interfaces folder

Note: https://docs.nestjs.com/modules

# Create Model

00. Create file <model_name>.entity.ts (ex: employee.entity.ts)

01. Create file <model_name>s.service.ts (ex: employees.service.ts)

Note: you can define dto first

02. Update file <model_name>s.controller.ts with updated service

03. Create file <model_name>.subscriber.ts (ex: employee.subscriber.ts)

04. Create file <new_model>s.module.ts (ex: employees.module.ts)

05. Update file app.module.ts

2. Follow the official documentations to setup typeorm into nestjs

https://docs.nestjs.com/recipes/sql-typeorm#sql-typeorm
