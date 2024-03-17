

const {DataTypes} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizeTransforms = require('sequelize-transforms');
const dayjs = require('dayjs');

let Agent = sequelize.define('agent', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    tenant: {
        type: DataTypes.STRING
    },
    public_id: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    sip_phone: {
        type: DataTypes.STRING
    },
    record: {
        type: DataTypes.STRING
    },
    group_id: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
    is_ready: {
        type: DataTypes.STRING
    },
    caller_id: {
        type: DataTypes.STRING
    },
    delay_interval: {
        type: DataTypes.STRING
    },
    user_id: {
        type: DataTypes.STRING
    },
    isDeleted: {
        type: DataTypes.BOOLEAN
    },
    isActive: {
        type: DataTypes.BOOLEAN
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    },
},{
    hooks: {
        beforeCreate: [
            async function (agent, options) {
                agent.isActive = true;
                agent.isDeleted = false;
            },
        ],
        beforeBulkCreate: [
            async function (agent, options) {
                if (agent !== undefined && agent.length) {
                    for (let index = 0; index < agent.length; index++) {
                        const element = agent[index];
                        element.isActive = true;
                        element.isDeleted = false;
                    }
                }
            },
        ],
    }
});
Agent.prototype.toJSON = function () {
    return Object.assign({}, this.get());
}
sequelizeTransforms(Agent);
module.exports = Agent;