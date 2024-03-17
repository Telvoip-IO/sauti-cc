/**
 * auth.js
 * @description :: service functions used in authentication
 */

const model = require('../model/index');
const dbService = require('../utils/dbService');

const {
    JWT,LOGIN_ACCESS,
    PLATFORM,MAX_LOGIN_RETRY_LIMIT,LOGIN_REACTIVE_TIME,DEFAULT_SEND_LOGIN_OTP,SEND_LOGIN_OTP,FORGOT_PASSWORD_WITH
} = require('../constants/auth');
const jwt = require('jsonwebtoken');
const common = require('../utils/common');
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const emailService = require('./email');
const ejs = require('ejs');
const uuid = require('uuid').v4;


/**
 * @description : service to generate JWT token for authentication.
 * @param {obj} user : user who wants to login.
 * @param {string} secret : secret for JWT.
 * @return {string}  : returns JWT token.
 */
const generateToken = async (user,secret) => {
    return jwt.sign( {
        id: user.id,
        'username': user.username
    }, secret, { expiresIn: JWT.EXPIRES_IN * 60 });
};

/**
 * @description : service of login user.
 * @param {string} username : username of user.
 * @param {string} password : password of user.
 * @param {string} platform : platform.
 * @param {boolean} roleAccess: a flag to request user`s role access
 * @return {obj} : returns authentication status. {flag, data}
 */

const login = async (username, password, platform, roleAccess) => {
    try {
        let where = { $or:[{ username:username },{ email:username }] };
        where.isActive = true;where.isDeleted = false;            const user = await dbService.findOne(model.user,where);
        if (!user) {
            return {
                flag:true,
                data:'User not exists'
            };
        }
        let userAuth = await dbService.findOne(model.userAuth, { userId: user.id });
        if (userAuth && userAuth.loginRetryLimit >= MAX_LOGIN_RETRY_LIMIT) {
            let now = dayjs();
            if (userAuth.loginReactiveTime) {
                let limitTime = dayjs(userAuth.loginReactiveTime);
                if (limitTime > now) {
                    let expireTime = dayjs().add(LOGIN_REACTIVE_TIME, 'minute');
                    if (!(limitTime > expireTime)){
                        return {
                            flag:true,
                            data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,limitTime)}.`
                        };
                    }
                    await dbService.update(model.userAuth, { userId:user.id }, {
                        loginReactiveTime: expireTime.toISOString(),
                        loginRetryLimit: userAuth.loginRetryLimit + 1
                    });
                    return {
                        flag: true,
                        data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,expireTime)}.`
                    };
                } else {
                    await dbService.update(model.userAuth, { userId:user.id }, {
                        loginReactiveTime: null,
                        loginRetryLimit: 0
                    });
                    userAuth = await dbService.findOne(model.userAuth, { userId: user.id });
                }
            } else {
                // send error
                let expireTime = dayjs().add(LOGIN_REACTIVE_TIME, 'minute');
                await dbService.update(model.userAuth, { userId:user.id }, {
                    loginReactiveTime: expireTime.toISOString(),
                    loginRetryLimit: userAuth.loginRetryLimit + 1
                });
                return {
                    flag: true,
                    data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,expireTime)}.`
                };
            }
        }
        if (password){
            let isPasswordMatched  = await user.isPasswordMatch(password);
            if (!isPasswordMatched){
                await dbService.update(model.userAuth,{ userId:user.id },{ loginRetryLimit:userAuth.loginRetryLimit + 1 });
                return {
                    flag:true,
                    data:'Incorrect Password'
                };
            }
        }
        const userData = user.toJSON();
        let token;
        if (!user.userType){
            return {
                flag:true,
                data:'You have not been assigned any role'
            };
        }
        // if (platform == PLATFORM.CLIENT){
        //     if (!LOGIN_ACCESS[user.userType].includes(PLATFORM.CLIENT)){
        //         return {
        //             flag:true,
        //             data:'you are unable to access this platform'
        //         };
        //     }
        //     token = await generateToken(userData,JWT.CLIENT_SECRET);
        // }
        // else if (platform == PLATFORM.ADMIN){
        //     if (!LOGIN_ACCESS[user.userType].includes(PLATFORM.ADMIN)){
        //         return {
        //             flag:true,
        //             data:'you are unable to access this platform'
        //         };
        //     }
        //     token = await generateToken(userData,JWT.ADMIN_SECRET);
        // }
        if (userAuth && userAuth.loginRetryLimit){
            await dbService.update(model.userAuth, { userId:user.id }, {
                loginRetryLimit: 0,
                loginReactiveTime: null
            });
        }
        let expire = dayjs().add(JWT.EXPIRES_IN, 'second').toISOString();
        await dbService.createOne(model.userTokens, {
            userId: user.id,
            token: token,
            tokenExpiredTime: expire
        });
        let userToReturn = {
            ...userData,
            token
        };
        // if (roleAccess){
        //     userToReturn.roleAccess = await common.getRoleAccessData(model,user.id);
        // }
        return {
            flag:false,
            data:userToReturn
        };

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    generateToken,
    login
}