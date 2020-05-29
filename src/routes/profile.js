import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;

// TODO: JWT
// StatusCode
router.get('/profile', async(req, res) => {
    Logger.GET('/profile');
    const userId = process.env.USERID || '5eced428cb0ecd4bae119125';  // JWT
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

router.put('/profile', async(req, res) => {
    Logger.PUT('/profile');
    const userId = process.env.USERID || '5eced428cb0ecd4bae119125';  // JWT
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

router.put('/profile/password', async(req, res) => {
    Logger.PUT('/profile/password');
    const userId = process.env.USERID || '5eced428cb0ecd4bae119125';  // JWT
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