module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
      organizer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      event_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      available_slots: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    Event.associate = (models) => {
      Event.belongsTo(models.User, { foreignKey: "organizer_id" });
      Event.hasMany(models.Booking, { foreignKey: "event_id" });
    };
    return Event;
  };
  