
const {DataTypes} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizeTransforms = require('sequelize-transforms');
const dayjs = require('dayjs');

let UserTokens = sequelize.define('userTokens', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: { type: DataTypes.INTEGER },
    token: { type: DataTypes.STRING },
    tokenExpiredTime: { type: DataTypes.DATE },
    isTokenExpired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isActive: { type: DataTypes.BOOLEAN },
    isDeleted: { type: DataTypes.BOOLEAN },
},{
    hooks: {
        beforeCreate: [
            async function (userTokens, options) {
                userTokens.isActive = true;
                userTokens.isDeleted = false;
            },
        ],
        beforeBulkCreate: [
            async function (userTokens, options) {
                if (userTokens !== undefined && userTokens.length) {
                    for (let index = 0; index < userTokens.length; index++) {
                        const element = userTokens[index];
                        element.isActive = true;
                        element.isDeleted = false;
                    }
                }
            },
        ],
    }
});
UserTokens.prototype.toJSON = function () {
    let values = Object.assign({}, this.get());
    values.tokenExpiredTime = dayjs(values.tokenExpiredTime).format('dd/mm/yy');
    return values;
}
sequelizeTransforms(UserTokens);

module.exports = UserTokens;