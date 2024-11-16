module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("organizer", "attendee"),
        allowNull: false,
      },
    });
    User.associate = (models) => {
      User.hasMany(models.Booking, { foreignKey: "user_id" });
      User.hasMany(models.Event, { foreignKey: "organizer_id" });
    };
    return User;
  };
  