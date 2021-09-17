import { EntitySchema } from "typeorm";

export const OrderEntity = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    status: {
      type: "enum",
      enum: ["new", "confirmed", "preparing", "delivering", "delivered"],
      default: "new",
    },
    description: {
      type: "varchar",
      nullable: false,
    },
    amount: {
      type: "int",
      nullable: false,
    },
    paymentMethod: {
      type: "enum",
      enum: ["cash", "credit"],
      nullable: false,
    },
    userId: {
      type: "int",
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    userId: {
      target: "User",
      type: "many-to-one",
    },
  },
});
