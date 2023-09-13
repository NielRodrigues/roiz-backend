import Sequelize, { Model } from "sequelize";
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from "bcryptjs";
import config from "../../config/database";

const sequelize = new Sequelize(config);

class User extends Model {}

User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    tel: Sequelize.STRING,
    password: Sequelize.VIRTUAL,
    password_hash: Sequelize.STRING,
    token: Sequelize.STRING,
  },
  {
    sequelize,
  }
);

User.addHook("beforeSave", async (user) => {
  if (user.password) {
    // eslint-disable-next-line no-param-reassign
    user.password_hash = await bcrypt.hash(user.password, 8);
  }
});

export default User;
