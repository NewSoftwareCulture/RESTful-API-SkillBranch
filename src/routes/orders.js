import { AsyncRouter } from 'express-async-router';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import authCheck from '../middleware/auth';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const Cart = models.Cart;
const Dish = models.Dish;
const Order = models.Order;
const Status = models.Status;

// "If-Modified-Since"
router.post('/orders/new', authCheck, async(req, res) => {
    Logger.POST('/orders/new');
    const userId = req.user._id;
    const address = req.body.address;
    const entrance = req.body.entrance;
    const floor = req.body.floor;
    const apartment = req.body.apartment;
    const intercom = req.body.intercom;
    const comment = req.body.comment;
    const orderId = mongoose.Types.ObjectId();
    const statusId = mongoose.Types.ObjectId();

    const cart = await Cart.findOne({userId: userId});
    let items = [];
    let total = 0;
    if(cart){
        await Promise.each(cart.items, async (element) => {
            const dishId = element.id;
            const amount = element.amount;
            const dish = await Dish.findOne({_id: dishId});
            const price = dish.price * amount;
            total += price;
            const result = {
                name: dish.dishName,
                image: dish.image,
                amount: amount,
                price: price,
                dishId: dishId,
            };
            items.push(result);
        }).then(async () => {
            const order = new Order({
                orderId,
                userId,
                total,
                address,
                entrance,
                floor,
                apartment,
                intercom,
                comment,    
                statusId: statusId,
                active: true,
                completed: false,
                items,
            });
            await order.save();
            Logger.db('Order created!');
            const status = new Status({
                statusId,
                name: 'В обработке',
                cancelable: true,
                active: true,
            });
            await status.save();
            Logger.db('Status order created!');
        }).then(async () => {
            const order = await Order.findOne({orderId: orderId});
            res.status(201).json({
                id: orderId,
                total: order.total,
                address: order.address,
                statusId: order.statusId,
                active: order.active,
                completed: order.completed,
                createdAt: Date.parse(order.createdAt),
                updatedAt: Date.parse(order.updatedAt),
                items: order.items,
            });
        });
    } else{
        res.status(400);
    };
});

router.get('/orders?:offset?:limit', authCheck, async(req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/orders?offset=${offset}&limit=${limit}`);
    const userId = req.user._id;
    const orders = await Order.find({userId: userId}).skip(offset).limit(limit);
    let result = orders.map(element => {
        return {
            id: element.orderId,
            total: element.total,
            address: element.address,
            statusId: element.statusId,
            active: element.active,
            completed: element.completed,
            createdAt: Date.parse(element.createdAt),
            updatedAt: Date.parse(element.updatedAt),
            items: element.items,
        };
    });
    res.status(200).json(result);
});

router.get('/orders/statuses', async(req, res) => {
    Logger.GET('/orders/statuses');
    const statuses = await Status.find();
    let result = statuses.map(element => {
        return {
            id: element.statusId,
            name: element.name,
            cancelable: element.cancelable,
            active: element.active,
            createdAt: Date.parse(element.createdAt),
            updatedAt: Date.parse(element.updatedAt),
        };
    });
    res.status(200).json(result);
    
});

router.put('/orders/cancel', authCheck, async(req, res) => {
    Logger.PUT('/orders/cancel');
    const orderId = req.body.orderId;
    const userId = req.user._id;
    const order = await Order.findOne({orderId: orderId, userId: userId});
    if(order){
        await Order.findOneAndUpdate({orderId: orderId}, {
            completed: true,
        });
        await Status.findOneAndUpdate({statusId: order.statusId}, {
            name: 'Отменен',
        });
        res.status(202).json({
            id: orderId,
            total: order.total,
            address: order.address,
            statusId: order.statusId,
            active: order.active,
            completed: false,
            createdAt: Date.parse(order.createdAt),
            updatedAt: Date.parse(order.updatedAt),
            items: order.items,
        });
    } else {
        res.status(400);
    };
});

module.exports = router;