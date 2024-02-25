'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class serviceRatingView extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      serviceRatingView.hasMany(models.rating_reviews,{
        foreignKey:"service_id"
      })
    }
  }
  serviceRatingView.init({
    service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    barber_id: DataTypes.INTEGER,
    total_rating: DataTypes.INTEGER,
    total_avg: DataTypes.FLOAT,
    total_one: DataTypes.INTEGER,
    total_two: DataTypes.INTEGER,
    total_three: DataTypes.INTEGER,
    total_four: DataTypes.INTEGER,
    total_five: DataTypes.INTEGER
  }, {
    tableName: 'serviceratingviews',
    timestamps: false,
    sequelize,
    modelName: 'serviceRatingView',
  });
  return serviceRatingView;
};