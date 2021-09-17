import { createConnection } from "typeorm";
import { OrderEntity } from "../entities/order.js";
import { ProductEntity } from "../entities/product.js";
import { ProductsQuantityEntity } from "../entities/products_quantity.js";
import { UserEntity } from "../entities/user.js";
import { enviroment } from "./enviroment.js";

const { DB_HOST, DB_PORT, DB_NAME, DB_PASSWORD, DB_USERNAME, IS_PRODUCTION } =
  enviroment;

export async function connect() {
  await createConnection({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    entities: [UserEntity, ProductEntity, OrderEntity, ProductsQuantityEntity],
    synchronize: true,
    ssl: { rejectUnauthorized: false },
  });

  console.log(`Database connected ✅`);
}
