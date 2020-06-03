import { AsyncRouter } from 'express-async-router';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import { hasUpdatedAtSince, getLastDate, Logger} from '../utils'; 
import authCheck from '../middleware/auth';
import models from '../models';

const router = AsyncRouter();

const Cart = models.Cart;
const Dish = models.Dish;
const Order = models.Order;
const Status = models.Status;

router.post('/orders/new', authCheck, async(req, res) => {
    Logger.POST('/orders/new');
    const userId = req.user._id;
    const { address, entrance, floor, apartment, intercom, comment } = req.body;
    const orderId = mongoose.Types.ObjectId();
    const statusId = mongoose.Types.ObjectId();

    const cart = await Cart.findOne({userId: userId});
    let items = [];
    let total = 0;
    if(!cart) return res.status(400).send();

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
        return res.status(201).json({
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
});

router.get('/orders', authCheck, async(req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/orders?offset=${offset}&limit=${limit}`);
    const userId = req.user._id;
    const orders = await Order.find({userId: userId}).skip(offset).limit(limit);
    if (!orders) return res.status(200).json([]);

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

    const lastDate = await getLastDate(result);
    res.setHeader('Last-Modified', lastDate);

    if (!hasUpdatedAtSince(result, req.headers['if-modified-since'])) return res.status(304).send();
    return res.status(200).json(result);
});

router.get('/orders/statuses', async(req, res) => {
    Logger.GET('/orders/statuses');
    const statuses = await Status.find();
    if (!statuses) return res.status(200).json([]);

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

    const lastDate = await getLastDate(result);
    res.setHeader('Last-Modified', lastDate);

    if (!hasUpdatedAtSince(result, req.headers['if-modified-since'])) return res.status(304).send();
    return res.status(200).json(result);    
});

router.put('/orders/cancel', authCheck, async(req, res) => {
    Logger.PUT('/orders/cancel');
    const orderId = req.body.orderId;
    const userId = req.user._id;
    const order = await Order.findOne({orderId: orderId, userId: userId});

    if(!order) return res.status(400).send();

    await Order.findOneAndUpdate({orderId: orderId}, {
        completed: true,
    });
    await Status.findOneAndUpdate({statusId: order.statusId}, {
        name: 'Отменен',
    });
    return res.status(202).json({
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
});

module.exports = router;