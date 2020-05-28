import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;

router.post('/profile/password', async(req, res) => {

});

module.exports = router;