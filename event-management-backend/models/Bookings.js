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
    slots_reserved: {
      type: DataTypes.INTEGER,  // Field to track the number of reserved slots
      allowNull: false,
      defaultValue: 1,  // Assuming each booking reserves one slot
    },
  }, {
    timestamps: false, // Disable timestamps
  });

  return Booking;
};
