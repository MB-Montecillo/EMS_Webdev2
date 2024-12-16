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
        model: 'Users', 
        key: 'user_id', 
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
        model: 'Locations',
        key: 'location_id', 
      },
      allowNull: true,
    },
  }, {
    timestamps: false, 
  });

  Event.associate = (models) => {
    Event.belongsTo(models.Location, {
      foreignKey: 'location_id',
      as: 'location', 
    });
  };

  return Event;
};
