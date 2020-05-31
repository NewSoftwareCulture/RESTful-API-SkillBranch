import { AsyncRouter } from 'express-async-router';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';  
import models from '../models/models';
import Logger from './Logger';
import config from '../../config';

const router = AsyncRouter();

const User = models.User;

async function checkEmail(email) {
    const re = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)");
    const user = await User.findOne({email: email});
    if(!user && re.test(email)) return true;
    return false;
};

router.post('/auth/register', async(req, res) => {
    Logger.POST('/auth/register');
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    let accessToken = '_';
    let refreshToken = '_';
    if (await checkEmail(email)) {
        let result = {
            firstName,
            lastName,
            email,
            password,
            accessToken,
            refreshToken,
        };
        let user = new User(result);
        await user.save();
        Logger.db('User created!');
        
        const tokenConfig = config.jwt.token;
        accessToken = await jwt.sign({
            id: user._id,
        }, tokenConfig.access.key, {expiresIn: tokenConfig.access.expiresIn});
        refreshToken = await jwt.sign({
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
        res.status(400);
        Logger.ERROR('User not created!');
    }
});

module.exports = router;