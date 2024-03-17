
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizeTransforms = require('sequelize-transforms');

const dayjs = require('dayjs');
const bcrypt = require('bcrypt');

let User = sequelize.define('user',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{ type:DataTypes.STRING },
    password:{ type:DataTypes.STRING },
    email:{ type:DataTypes.STRING },
    first_name:{ type:DataTypes.STRING },
    last_name:{ type:DataTypes.STRING },
    phone_number:{ type:DataTypes.STRING },
    public_id:{ type:DataTypes.UUID },
    isActive:{ type:DataTypes.BOOLEAN },
    createdAt:{ type:DataTypes.DATE },
    updatedAt:{ type:DataTypes.DATE },
    userType:{ type:DataTypes.INTEGER },
    isDeleted:{ type:DataTypes.BOOLEAN }
},{
    hooks:{
        beforeCreate: [
            async function (user,options){
                if (user.password){ user.password = await bcrypt.hash(user.password, 8);}
                user.isActive = true;
                user.isDeleted = false;
            },
        ],
        beforeBulkCreate: [
            async function (user,options){
                if (user !== undefined && user.length) {
                    for (let index = 0; index < user.length; index++) {
                        const element = user[index];
                        if (element.password){
                            element.password = await bcrypt.hash(element.password, 8);
                        }
                        element.isActive = true;
                        element.isDeleted = false;
                    }
                }
            },
        ],
        beforeUpdate: [
            async function (user,options){
                if (user.password){ user.password = await bcrypt.hash(user.password, 8);}
            },
        ],
    }

});

User.prototype.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
}

User.prototype.toJSON = function () {
    let values = Object.assign({}, this.get());
    values.createdAt = dayjs(values.createdAt).format('YYYY-MM-DD');
    values.updatedAt = dayjs(values.updatedAt).format('YYYY-MM-DD');
    delete values.password;
    return values
}

sequelizeTransforms(User);

module.exports = User;