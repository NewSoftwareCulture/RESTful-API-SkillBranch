import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.User;

router.get('/dishes', async(req, res) => {
    
});

router.post('/auth/recovery/code', async(req, res) => {

});

router.post('/auth/recovery/password', async(req, res) => {

});

module.exports = router;