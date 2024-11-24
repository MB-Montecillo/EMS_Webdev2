module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    booking_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // Ensure this matches the Users model
        key: 'user_id', // Ensure this matches the key in the Users model
      },
      allowNull: false,
    },
    event_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Events', // Ensure this matches the Events model
        key: 'event_id', // Ensure this matches the key in the Events model
      },
      allowNull: false,
    },
    booking_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false, // Disable timestamps
});

  return Booking;
};
