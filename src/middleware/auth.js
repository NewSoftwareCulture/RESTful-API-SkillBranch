import passport from 'passport';
import Logger from '../routes/Logger';

module.exports = (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
        if(!user){ 
            if(Date.parse(new Date()) > Date.parse(info.expiredAt)){
                return res.status(402).send();
            } else {
                Logger.ERROR('Unauthorized');
                return res.status(401).send();
            }
        } else {
            req.user = user;
            next();
        }
    })(req, res, next)
};