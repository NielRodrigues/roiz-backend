/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("products", "details", {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: "",
    });
  },

  async down(queryInterface) {
    return queryInterface.removeColumn("products", "details");
  },
};