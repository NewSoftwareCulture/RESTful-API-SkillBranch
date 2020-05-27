import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;

router.get('/cart', async(req, res) => {

})

router.put('/cart', async(req, res) => {

})

module.exports = router;