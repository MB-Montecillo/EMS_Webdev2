module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['organizer', 'attendee']],
      },
    },
    profile_picture: {
      type: DataTypes.STRING, 
      allowNull: true,      
    },
  }, {
    timestamps: false, 
  });
};
