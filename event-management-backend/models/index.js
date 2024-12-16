const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('event_management_db', 'root', '?-8!4Y1DscO>', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

const User = require('./User')(sequelize, DataTypes);
const Event = require('./Events')(sequelize, DataTypes);
const Booking = require('./Bookings')(sequelize, DataTypes);
const Location = require('./Locations')(sequelize, DataTypes);  

User.hasMany(Event, { foreignKey: 'organizer_id' });
Event.belongsTo(User, { foreignKey: 'organizer_id' });
User.hasMany(Booking, { foreignKey: 'user_id' });
Event.hasMany(Booking, { foreignKey: 'event_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });
Booking.belongsTo(Event, { foreignKey: 'event_id' });
Event.belongsTo(Location, { foreignKey: 'location_id' }); 
Location.hasMany(Event, { foreignKey: 'location_id' }); 

sequelize.sync({ force: false }) 
  .then(() => console.log('Database synchronized successfully.'))
  .catch(err => console.error('Error syncing database:', err));

module.exports = { sequelize, User, Event, Booking, Location };