// import bodyParser from 'body-parser';
import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;



router.get('/:firstName', async (req, res, next) => {
    console.log('[GET] /api/auth/:firstName');
    
    // res.send(req.params.id)
    const user = await User.findOne({firstName: req.params.firstName});
    // res.send(users);
    res.json(user);
    Logger.PUT(user._id);
    // console.log(users.params._id);
    // console.log(users.body.userId);
    // next();
    // res.status(400).send('Hello!');
});

// router.get('/:lastName', async (req, res) => {
//     console.log('[GET] /api/auth/:lastName');
    
//     // res.send(req.params.id)
//     const users = await User.find({lastName: req.params.lastName});
//     res.json(users);
//     // res.status(400).send('Hello!');
// });

router.get('/user', async (req, res) => {
    res.send('Hello User!');
    Logger('/api/auth/user', 'GET');
});

router.post('/', async(req, res) => {
    const userId = 1;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const accessToken = "110";
    const refreshToken = "220";

    
    const result = {
        userId,
        firstName,
        lastName,
        email,
        password,
        accessToken,
        refreshToken
    }
    const user = new User(result);

    user.save().then(() => Logger('User created!'));
    res.json(result);
});

module.exports = router;