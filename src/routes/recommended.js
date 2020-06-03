import { AsyncRouter } from 'express-async-router';
import models from '../models';
import { Logger } from '../utils';

const router = AsyncRouter();

const { Dish } = models;

router.get('/main/recommend', async(req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/main/recommend?offset=${offset}&limit=${limit}`);
    const dishes = await Dish.find({isRecomendation: true}).skip(offset).limit(limit);
    if (!dishes) return res.status(200).json([]);

    let result = await dishes.map(element => {
        return element._id;
    });
    res.status(200).json(result);
});

module.exports = router;