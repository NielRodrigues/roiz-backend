import Sequelize, { Model } from "sequelize";
import config from "../../config/database";

const sequelize = new Sequelize(config);

class Rate extends Model {}

Rate.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: { model: "users", key: "id" },
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
    message: Sequelize.TEXT,
    stars: Sequelize.INTEGER,
  },
  {
    sequelize,
  }
);

export default Rate;
