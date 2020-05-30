import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const Dish = models.Dish;

// TODO: 'If-Modified-Since'
router.get('/dishes?:offset?:limit', async(req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/dishes?offset=${offset}&limit=${limit}`);
    const dishes = await Dish.find().skip(offset).limit(limit);
    if(dishes){
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
                createdAt: Date.parse(element.createdAt),
                updatedAt: Date.parse(element.updatedAt),
            };
        });
        res.status(200).json(result);
    } else{
        res.status(304);
    };
});

module.exports = router;