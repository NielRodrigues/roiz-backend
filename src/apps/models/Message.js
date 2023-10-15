import Sequelize, { Model } from "sequelize";
import config from "../../config/database";

const sequelize = new Sequelize(config);

class Message extends Model {}

Message.init(
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
    subject: Sequelize.STRING,
    message: Sequelize.STRING,
    responded: Sequelize.BOOLEAN,
  },
  {
    sequelize,
  }
);

export default Message;
