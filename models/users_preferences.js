'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users_preferences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users_preferences.hasMany(models.custom_services,{
        foreignKey:"id"
      })
      users_preferences.belongsTo(models.users,{
        foreignKey:"id"
      })
    }
  }
  users_preferences.init({
    barber_id: DataTypes.INTEGER,
    about_me: DataTypes.STRING,
    languages: DataTypes.STRING,
    skills: DataTypes.STRING,
    stylist_type: {
      type: DataTypes.ENUM('1', '2', '3'),
      comment:('1 => junior','2 => senior', '3=> advanced'),
      allowNull: false
    },
    images: DataTypes.STRING,
    videos: DataTypes.STRING,
    work_radius: DataTypes.FLOAT,
    available_for: {
    type: DataTypes.ENUM('1','2','3','4'),
    comment:('1 => men','2 => women','3 => kids','4 => seniors'),
      allowNull:false
    },
    active_status:{ 
      type:DataTypes.BOOLEAN,
    defaultValue:'0'}
  }, {
    sequelize,
    modelName: 'users_preferences',
  });
  return users_preferences;
};