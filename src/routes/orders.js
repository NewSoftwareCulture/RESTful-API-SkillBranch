import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const User = models.Order;

router.post('/orders/new', async(req, res) => {

});

router.get('/orders', async(req, res) => {

});

router.get('/orders/statuses', async(req, res) => {

});

router.put('/orders/cancel/orderId', async(req, res) => {

});

module.exports = router;