/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("requests", {
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
      id_payment_mp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status_request: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      value: {
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
    return queryInterface.dropTable("requests");
  },
};
