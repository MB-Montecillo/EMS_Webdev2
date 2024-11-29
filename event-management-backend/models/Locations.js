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
      timestamps: false, // Disable timestamps
    });
  
    // Optional: If you want to define reverse associations
    Location.associate = (models) => {
      // A Location can have many Events
      Location.hasMany(models.Event, {
        foreignKey: 'location_id',
        as: 'events', // You can access the events of a location as 'events'
      });
    };
  
    return Location;
  };
  