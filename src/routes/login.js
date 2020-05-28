import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;

// Password (en)crypt
// StatusCode
router.post('/auth/login', async(req, res) => {
    Logger.POST('/auth/login');

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({email: email});
    if (password === user.password) {
        Logger.connect('/auth/login');
        res.status(201).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken
        });
    } else {
        Logger.ERROR('/auth/login');
        res.status(402).send('Try again!');
    }
});

module.exports = router;