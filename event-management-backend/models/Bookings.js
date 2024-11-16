module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("Booking", {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      booking_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
    Booking.associate = (models) => {
      Booking.belongsTo(models.User, { foreignKey: "user_id" });
      Booking.belongsTo(models.Event, { foreignKey: "event_id" });
    };
    return Booking;
  };
  