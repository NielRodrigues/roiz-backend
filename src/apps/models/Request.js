import Sequelize, { Model } from "sequelize";
import config from "../../config/database";
import Address from "./Address";
import ProductRequest from "./ProductRequest";

const sequelize = new Sequelize(config);

class Request extends Model {};

Request.init(
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
    id_payment_mp: Sequelize.INTEGER,
    status_request: Sequelize.STRING,
    value: Sequelize.FLOAT,
  },
  {
    sequelize,
  }
);

Request.hasMany(Address);
Address.belongsTo(Request, { foreignKey: "request_id" });

Request.hasMany(ProductRequest);
ProductRequest.belongsTo(Request, { foreignKey: "request_id" });

export default Request;