/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("product_requests", {
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
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    return queryInterface.dropTable("product_requests");
  },
};
