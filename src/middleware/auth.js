import passport from 'passport';
import Logger from '../utils/Logger';

module.exports = (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
        if (!user){ 
            if (Date.parse(new Date()) > Date.parse(info.expiredAt)){
                Logger.ERROR('Token is over!')
                return res.status(401).send();
            } else {
                Logger.ERROR('Token not found!');
                return res.status(402).send();
            }
        } else {
            req.user = user;
            next();
        }
    })(req, res, next)
};