import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';



const router = AsyncRouter();

const User = models.User;

router.post('/auth/login', async(req, res) => {
    Logger.POST('/auth/login');

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({email: email});
    if (password === user.password) {
        Logger.connect('/auth/login');
        res.send('Connected');
    } else {
        Logger.ERROR('/auth/login')
        res.send('Try again!')
    }
});

module.exports = router;