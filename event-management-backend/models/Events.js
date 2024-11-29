module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    organizer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // Ensure this matches the User model's table name
        key: 'user_id', // Ensure this matches the key in the User model
      },
      allowNull: false,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    available_slots: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Locations', // Reference the Locations table
        key: 'location_id', // Ensure this matches the primary key in the Locations table
      },
      allowNull: true,
    },
  }, {
    timestamps: false, // Disable timestamps
  });

  // Define the association between Event and Location (optional, if you need it in the model)
  Event.associate = (models) => {
    // Define a many-to-one relationship between Event and Location
    Event.belongsTo(models.Location, {
      foreignKey: 'location_id',
      as: 'location', // You can access location details as 'location' in an event
    });
  };

  return Event;
};
