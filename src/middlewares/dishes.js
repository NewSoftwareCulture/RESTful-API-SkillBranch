import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const Dish = models.Dish;

// TODO: 'If-Modified-Since'
// StatusCode
router.get('/dishes?:offset?:limit', async(req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/dishes?offset=${offset}&limit=${limit}`);
    const dishes = await Dish.find().skip(offset).limit(limit);
    let result = dishes.map(element => {
        return {
            id: element._id,
            name: element.dishName,
            description: element.description,
            image: element.image,
            oldPrice: element.oldPrice,
            price: element.price,
            rating: element.rating,
            likes: element.likes,
            category: element.category,
            active: element.active,
            createdAt: element.createdAt,
            updatedAt: element.updatedAt,
        };
    });
    res.json(result);
});

module.exports = router;