import Sequelize, { Model } from "sequelize";
import config from "../../config/database";

const sequelize = new Sequelize(config);

class Favorite extends Model {}

Favorite.init(
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
  },
  {
    sequelize,
  }
);

export default Favorite;
