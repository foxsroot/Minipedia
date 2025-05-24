const { sequelize } = require("./src/models");

module.exports = async () => {
  await sequelize.close();
};
