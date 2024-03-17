

const passport = require('passport');
const {
  LOGIN_ACCESS,PLATFORM
} = require('../constants/auth');


const verifyCallback = (req, resolve, reject, platform) => async (err, user, info) => {
    if (err || info || !user) {
        return reject('Unauthorized User');
    }
    req.user = user;
    if (!user.isActive) {
        return reject('User is deactivated');
    }
    let userToken = await dbService.findOne(model.userTokens,{
        token:(req.headers.authorization).replace('Bearer ',''),
        userId:user.id
    });
    if (!userToken){
        return reject('Token not found');
    }
    if (userToken.isTokenExpired){
        return reject('Token is Expired');
    }
    if (user.userType) {
        let allowedPlatforms = LOGIN_ACCESS[user.userType] ? LOGIN_ACCESS[user.userType] : [];
        if (!allowedPlatforms.includes(platform)) {
        return reject('Unauthorized user');
        }
    }
    resolve();
}

const auth = (platform) => async (req, res, next) => {
    if(platform === PLATFORM.CLIENT){
        return new Promise((resolve, reject) => {
            passport.authenticate('client-rule', { session: false }, verifyCallback(req, resolve, reject, platform))(
                req,
                res,
                next
            );
        })
        .then(() => next())
        .catch((err) => {
            return res.unAuthorized();
        });
    }
}

module.exports = {
    auth
}