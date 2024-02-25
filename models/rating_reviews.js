'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rating_reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      rating_reviews.hasMany(models.users,{
        foreignKey:"id"
      }),
      rating_reviews.hasMany(models.custom_services,{
        foreignKey:"id"
      }),
      rating_reviews.belongsTo(models.serviceRatingView,{
        foreignKey:"service_id"
      })
    }
  }
  rating_reviews.init({
    customer_id: DataTypes.INTEGER,
    barber_id: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'rating_reviews',
  });
  return rating_reviews;
};