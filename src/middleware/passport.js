import passportJwt from 'passport-jwt';
import models from '../models/models';
import Logger from '../utils/Logger';
import config from '../../config';

const jwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const { User } = models;
const { key } = config.jwt.token.access;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: key,
};

module.exports = passport => {
    passport.use(
        new jwtStrategy(options, async(payload, done) => {
            try {
                const user = await User.findById(payload.id).select('email id');
                user ? done(null, user) : done(null, false);
            } catch(e){
                Logger.ERROR(e);
            }  
        })
    );
};