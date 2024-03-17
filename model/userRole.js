
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizeTransforms = require('sequelize-transforms');

let UserRole = sequelize.define('userRole',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    roleId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    isActive:{ type:DataTypes.BOOLEAN },
    createdAt:{ type:DataTypes.DATE },
    updatedAt:{ type:DataTypes.DATE },
    addedBy:{ type:DataTypes.INTEGER },
    updatedBy:{ type:DataTypes.INTEGER },
    isDeleted:{ type:DataTypes.BOOLEAN }
},{
    hooks : {
        beforeCreate: [
            async function (userRole,options){
                userRole.isActive = true;
                userRole.isDeleted = false;
            }
        ],
        beforeBulkCreate: [
            async function (userRole,options){
                if (userRole !== undefined && userRole.length) {
                    for (let index = 0; index < userRole.length; index++) {
                        const element = userRole[index];
                        element.isActive = true;
                        element.isDeleted = false;
                    }
                }
            }
        ],
    }
});
UserRole.prototype.toJSON = function () {
    return Object.assign({}, this.get());
}

sequelizeTransforms(UserRole);

module.exports = UserRole;