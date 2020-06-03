import { AsyncRouter } from 'express-async-router';
import models from '../models';
import { hasUpdatedAtSince, getLastDate, Logger } from '../utils'; 


const router = AsyncRouter();

const { Dish } = models;

router.get('/dishes', async(req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/dishes?offset=${offset}&limit=${limit}`);
    const dishes = await Dish.find().skip(offset).limit(limit);
    if (!dishes) return res.status(200).json([]);

    let result = dishes.map(element => ({
        id: element._id,
        name: element.dishName,
        description: element.description,
        image: element.image,
        oldPrice: element.oldPrice,
        price: element.price,
        rating: element.rating,
        likes: element.likes,
        category: element.categoryId,
        commentsCount: element.commentsCount,
        active: element.active,
        createdAt: Date.parse(element.createdAt),
        updatedAt: Date.parse(element.updatedAt),
    }));

    const lastDate = await getLastDate(result);
    res.setHeader('Last-Modified', lastDate);

    if (!hasUpdatedAtSince(result, req.headers['if-modified-since'])) return res.status(304).send();
    return res.status(200).json(result);
});

module.exports = router;