import { AsyncRouter } from 'express-async-router';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import models from '../models/models';
import Logger from './Logger';
import config from '../../config';

const router = AsyncRouter();

const User = models.User;

router.post('/auth/refresh', async(req, res) => {
    Logger.POST('/auth/refresh');
    const refreshToken = req.body.refreshToken;
    const decoded =  jwtDecode(refreshToken);
    if(decoded.id) {
        const tokenConfig = config.jwt.token;
        const accessToken = await jwt.sign({
            id: decoded.id,
        }, tokenConfig.access.key, {expiresIn: tokenConfig.access.expiresIn});
        await User.findOneAndUpdate({_id: decoded.id}, {
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
        res.status(201).json({
            accessToken: accessToken,
        });
    } else {
        res.status(402);
    };
});

module.exports = router;