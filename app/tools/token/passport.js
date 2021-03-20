const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    Config = require('./config');
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = Config.SECREORKEY; //token证书
const userDao = require('../../dao/userDao'); 

module.exports = passport => {
    passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
        const user = await userDao.findById(jwt_payload.id)
        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    }));
}