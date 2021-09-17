import { EntitySchema } from "typeorm";

export const ProductsQuantityEntity = new EntitySchema({
  name: "ProductsQuantity",
  tableName: "products_quantity",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    orderId: {
      type: "int",
      nullable: false,
    },
    productId: {
      type: "int",
      nullable: false,
    },
    quantity: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    orderId: {
      target: "Order",
      type: "many-to-one",
    },
    productId: {
      target: "Product",
      type: "many-to-one",
    },
  },
});
