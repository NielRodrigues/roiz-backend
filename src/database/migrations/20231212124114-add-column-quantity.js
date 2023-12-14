/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("products", "quantity_products", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 15,
    });
  },

  async down(queryInterface) {
    return queryInterface.removeColumn("products", "quantity_products");
  },
};
