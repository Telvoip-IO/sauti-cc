

const { Strategy, ExtractJwt } = require('passport-jwt');
const { JWT } = require('../constants/auth');

const passportStrategy = (passport) => {
    const options = {}
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = JWT.ADMIN_SECRET || JWT.CLIENT_SECRET || JWT.AGENT_SECRET || JWT.SUPER_SECRET;
    passport.use(
        new Strategy(options, (payload, done) => {
            if (payload.id) {
                return done(null, payload);
            }
            return done('No User Found', {});
        })
    );
}

module.exports = { passportStrategy };