import { EntitySchema } from "typeorm";

export const ProductEntity = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    photo: {
      type: "varchar",
      nullable: false,
    },
    price: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});
