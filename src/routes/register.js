import { AsyncRouter } from 'express-async-router';
import bcrypt from 'bcryptjs';  
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;

async function checkEmail(email) {
    const re = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)");
    const user = await User.findOne({email: email});
    if(!user && re.test(email)) return true;
    return false;
};

// TODO:
// StatusCode
router.post('/auth/register', async(req, res) => {
    Logger.POST('/auth/register');
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    const accessToken = '';
    const refreshToken = '';
    if (await checkEmail(email)) {
        let result = {
            firstName,
            lastName,
            email,
            password,
            accessToken,
            refreshToken
        };
        let user = new User(result);
        await user.save();

        Logger.db('User created!');

        user = await User.findOne({email: email});        
        result['id'] =  user._id;
        res.json(result); 
    } else {
        res.status(400);
        Logger.ERROR('User not created!');
    }
});

module.exports = router;