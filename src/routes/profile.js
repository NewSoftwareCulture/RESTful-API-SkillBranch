import { AsyncRouter } from 'express-async-router';
import passport from 'passport';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;

// TODO:
// StatusCode
router.get('/profile', passport.authenticate('jwt', {session: false}), async(req, res) => {
    Logger.GET('/profile');
    const userId = req.user._id;
    const user = await User.findOne({_id: userId});
    res.json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    });
});

async function checkEmail(email, userId) {
    const otherUser = await User.findOne({email: email});
    if(otherUser._id !== userId) throw new Error('Данная почта занята другим пользователем');
}

router.put('/profile', passport.authenticate('jwt', {session: false}), async(req, res) => {
    Logger.PUT('/profile');
    const userId = req.user._id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const user = await User.findOne({_id: userId});
    if(user) {
        try {
            await checkEmail(email, userId);
            await User.findOneAndUpdate({_id: userId}, { 
                firstName: firstName, 
                lastName: lastName,
                email: email,
            });
            Logger.db('Profile update!');
            const user = await User.findOne({_id: userId});
            res.json({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            });
        } catch(e) {
            Logger.ERROR(e.message);
        };
    } else {
        res.status(404);
    };
});

router.put('/profile/password', passport.authenticate('jwt', {session: false}), async(req, res) => {
    Logger.PUT('/profile/password');
    const userId = req.user._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const user = await User.findOne({_id: userId});
    if (oldPassword === user.password) {
        await User.findOneAndUpdate({_id: userId}, { 
            password: newPassword, 
        });
        Logger.db('Password update!');
    };
});

module.exports = router;