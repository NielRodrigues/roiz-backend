import Sequelize, { Model } from "sequelize";
import config from "../../config/database";

const sequelize = new Sequelize(config);

class ProductRequest extends Model {};

ProductRequest.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    request_id: {
      type: Sequelize.INTEGER,
      references: { model: "requests", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      allowNull: false,
    },
    product_id: {
      type: Sequelize.INTEGER,
      references: { model: "products", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      allowNull: false,
    },
    quantity: Sequelize.INTEGER,
  },
  {
    sequelize,
    modelName: "ProductRequest",
    name: {
      singular: "product_request",
      plural: "product_requests",
    },
  }
);

export default ProductRequest;