import { AsyncRouter } from 'express-async-router';
// import models from '../models/models';
import User from '../models/User/User'
// import bodyParser from 'body-parser';
const router = AsyncRouter();

// const User = models.User;



router.get('/', async (req, res) => {
    res.status(400).send('Hello!');
    console.log('[GET] /api/auth/');
});

router.get('/user', async (req, res) => {
    res.send('Hello User!');
    console.log('[GET] /api/auth/user');
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

    user.save().then(() => console.log('User created!'));
    res.json(result);
});

module.exports = router;