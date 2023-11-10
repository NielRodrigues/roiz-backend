/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("rates", {
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
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      stars: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 4,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable("rates");
  },
};
