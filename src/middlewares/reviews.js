import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;

router.get('/reviews', async(req, res) => {

})

router.post('/reviews/new', async(req, res) => {

})

module.exports = router;