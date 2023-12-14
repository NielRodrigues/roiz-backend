import Sequelize, { Model } from "sequelize";
import config from "../../config/database";

const sequelize = new Sequelize(config);

class Product extends Model {}

Product.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    picture: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price_of: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    price_purchase: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    link: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    affiliation: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    quantity_products: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

export default Product;
