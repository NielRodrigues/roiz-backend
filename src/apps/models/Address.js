import Sequelize, { Model } from "sequelize";
import config from "../../config/database";

const sequelize = new Sequelize(config);

class Address extends Model {};

Address.init(
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
    street: Sequelize.STRING,
    number: Sequelize.INTEGER,
    postal_code: Sequelize.STRING,
    complement: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
  },
  {
    sequelize,
    modelName: "Address",
    name: {
      singular: "address",
      plural: "address",
    },
  }
);

export default Address;