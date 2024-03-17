
const dbConnection = require('../config/dbConnection');
const db = {};
db.sequelize = dbConnection;


db.user = require('./user');
db.organisation = require('./organisation');
db.userTokens = require('./userTokens');
db.role = require('./role');
db.userRole = require('./userRole');
db.userAuth = require('./userAuthSettings');


db.user.hasMany(db.userTokens, {
    foreignKey: 'userId',
    as: 'userTokens'
    });

db.user.hasMany(db.userRole, {
    foreignKey: 'userId',
    as: 'userRole'
    });

db.user.hasMany(db.organisation, {
    foreignKey: 'publicId',
    as: 'organisation',
    sourceKey: "id"
});

db.organisation.belongsTo(db.user, {
    foreignKey: 'publicId',
    as: 'user',
   targetKey: "id"
});

db.user.hasMany(db.role, {
    foreignKey: 'addedBy',
    as: 'role',
    sourceKey: "id"
});

db.user.hasMany(db.organisation, {
    foreignKey: 'updatedBy',
    sourceKey: 'id'
});
db.user.belongsTo(db.user, {
    foreignKey: 'addedBy',
    as: '_addedBy',
    targetKey: 'id'
});
db.user.hasMany(db.user, {
    foreignKey: 'addedBy',
    sourceKey: 'id'
});
db.user.belongsTo(db.user, {
    foreignKey: 'updatedBy',
    as: '_updatedBy',
    targetKey: 'id'
});
db.user.hasMany(db.user, {
    foreignKey: 'updatedBy',
    sourceKey: 'id'
});



module.exports = db;
