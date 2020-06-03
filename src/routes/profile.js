import { AsyncRouter } from 'express-async-router';
import bcrypt from 'bcryptjs';
import authCheck from '../middleware/auth';
import models from '../models';
import { Logger } from '../utils';

const router = AsyncRouter();

const { User } = models;

async function checkEmail(email, userId) {
    const otherUser = await User.findOne({email: email});
    if(!otherUser || String(otherUser._id) === String(userId)) return false;
    return true;
}

router.get('/profile', authCheck, async(req, res) => {
    Logger.GET('/profile');
    const userId = req.user._id;
    const user = await User.findOne({_id: userId});
    if (!user) return res.status(402).send();
    return res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    });
});

router.put('/profile', authCheck, async(req, res) => {
    Logger.PUT('/profile');
    const userId = req.user._id;
    const { firstName, lastName, email } = req.body;

    const user = await User.findOne({_id: userId});
    if (!user) return res.status(402).send();

    if (await checkEmail(email, userId)) return res.status(402).send();

    await User.findByIdAndUpdate(userId, { 
        firstName: firstName, 
        lastName: lastName,
        email: email,
    });
    const userUpd = await User.findById(userId);
    Logger.db('Profile update!');
    return res.status(202).json({
        id: userUpd._id,
        firstName: userUpd.firstName,
        lastName: userUpd.lastName,
        email: userUpd.email,
    });
});

router.put('/profile/password', authCheck, async(req, res) => {
    Logger.PUT('/profile/password');
    const userId = req.user._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const user = await User.findOne({_id: userId});
    if(!user) return res.status(402).send();

    const passwordCheck = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordCheck) return res.status(400).send();
    
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(newPassword, salt);
    await User.findByIdAndUpdate(userId, { 
        password: password, 
    });
    Logger.db('Password update!');
    return res.status(202).json();
});

module.exports = router;