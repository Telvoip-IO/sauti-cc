

const {DataTypes} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizeTransforms = require('sequelize-transforms');

let Organisation = sequelize.define('organisation',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        lowercase: false,
        allowNull: false,
        primaryKey: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        lowercase: false,
        allowNull: false,
        primaryKey: false
    },
    phone: { type: DataTypes.STRING },
    code: {
        type: DataTypes.STRING,
        unique: true,
        lowercase: false,
        validate: { len: [3] },
        allowNull: false,
        primaryKey: false
    },
    address: { type: DataTypes.STRING },
    balance: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
    addedBy: { type: DataTypes.INTEGER },
    updatedBy: { type: DataTypes.INTEGER },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    billing_type: { type: DataTypes.INTEGER , allowNull: true},
    pay_type: { type: DataTypes.INTEGER , allowNull: true, defaultValue: 1},
    ivr_limit: { type: DataTypes.INTEGER , allowNull: true, defaultValue: 1},
    agent_limit: { type: DataTypes.INTEGER , allowNull: true, defaultValue: 5},
    group_limit: { type: DataTypes.INTEGER , allowNull: true, defaultValue: 2},
    duration_storage: { type: DataTypes.INTEGER , allowNull: true,},
    callback_url: { type: DataTypes.STRING , allowNull: true, },
    status: {type: DataTypes.INTEGER, }
}, {
    hooks: {
        beforeCreate: [
            async function (organisation, options) {
                organisation.isActive = true;
                organisation.isDeleted = false;
            },
        ],
        beforeBulkCreate: [
            async function (organisation, options) {
                if (organisation !== undefined && organisation.length) {
                    for (let index = 0; index < organisation.length; index++) {
                        const element = organisation[index];
                        element.isActive = true;
                        element.isDeleted = false;
                    }
                }
            },
        ],
    }

});
Organisation.prototype.toJSON = function () {
    return Object.assign({}, this.get());
}
sequelizeTransforms(Organisation);

module.exports = Organisation;