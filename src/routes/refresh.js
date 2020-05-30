import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;
// TODO:
// JWT
// StatusCodes 201 402
router.post('/auth/refresh', async(req, res) => {

});

module.exports = router;