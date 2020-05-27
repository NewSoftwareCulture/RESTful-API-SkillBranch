import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;

router.get('/favorite', async(req, res) => {

});

router.put('/favorite/change', async(req, res) => {

});

module.exports = router;