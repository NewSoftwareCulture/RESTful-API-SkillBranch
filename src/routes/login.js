import { AsyncRouter } from 'express-async-router';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import models from '../models/models';
import Logger from './Logger';
import config from '../../config';

const router = AsyncRouter();

const User = models.User;

router.post('/auth/login', async(req, res) => {
    Logger.POST('/auth/login');

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({email: email});
    if(user) {
        const passwordCheck = bcrypt.compareSync(password, user.password);
        if (passwordCheck) {
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
            res.status(201).json({
                id: updUser._id,
                firstName: updUser.firstName,
                lastName: updUser.lastName,
                email: updUser.email,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } else {
            Logger.ERROR('/auth/login');
            res.status(402);
        };
    };
});

module.exports = router;