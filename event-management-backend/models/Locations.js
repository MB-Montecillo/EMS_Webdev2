module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    location_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: false, 
  });

  Location.associate = (models) => {
    Location.hasMany(models.Event, {
      foreignKey: 'location_id',
      as: 'events',
    });
  };

  return Location;
};
