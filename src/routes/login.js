import { AsyncRouter } from 'express-async-router';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import models from '../models';
import { Logger } from '../utils';
import config from '../../config';

const router = AsyncRouter();

const User = models.User;

router.post('/auth/login', async(req, res) => {
    Logger.POST('/auth/login');

    const { email, password }  = req.body;
    const user = await User.findOne({email: email});

    if (!user) {
        Logger.ERROR('/auth/login');
        return res.status(402).send();
    };
    const passwordCheck = bcrypt.compareSync(password, user.password);
    if (!passwordCheck) return res.status(402).send();

    Logger.connect('/auth/login');
    const tokenConfig = config.jwt.token;
    const accessToken = await jwt.sign({
        id: user._id,
    }, tokenConfig.access.key, {expiresIn: tokenConfig.access.expiresIn});
    const refreshToken = await jwt.sign({
        id: user._id,
    }, tokenConfig.refresh.key, {});
    const updUser = await User.findOneAndUpdate({email: email}, {
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
    return res.status(201).json({
        id: updUser._id,
        firstName: updUser.firstName,
        lastName: updUser.lastName,
        email: updUser.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
});

module.exports = router;