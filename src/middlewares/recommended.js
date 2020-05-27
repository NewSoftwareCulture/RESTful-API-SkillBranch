import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;

router.get('/main/recommend', async(req, res) => {

});

module.exports = router;