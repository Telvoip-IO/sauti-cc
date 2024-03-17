

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizeTransforms = require('sequelize-transforms');


let Role = sequelize.define('role',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    code:{
        type:DataTypes.STRING,
        allowNull:false
    },
    weight:{
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
    isDeleted:{ type:DataTypes.BOOLEAN },
},{
    hooks:{
        beforeCreate: [
            async function (role,options){
                role.isActive = true;
                role.isDeleted = false;
            },
        ],
        beforeBulkCreate: [
            async function (role,options){
                if (role !== undefined && role.length) {
                    for (let index = 0; index < role.length; index++ ) {

                        const element = role[index];
                        element.isActive = true;
                        element.isDeleted = false;
                    }
                }
            },
        ],
    }
});
Role.prototype.toJSON = function () {
    return Object.assign({}, this.get());
}
sequelizeTransforms(Role);
module.exports = Role;