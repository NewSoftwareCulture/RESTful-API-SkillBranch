import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const Favorite = models.Favorite;

// TODO: JWT
// StatusCode
router.get('/favorite?:offset?:limit', async(req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/favorite?offset=${offset}&limit=${limit}`);
    const userId = '5eced428cb0ecd4bae119125';  // JWT
    const favorites = await Favorite.find({userId: userId, favorite: true}).skip(offset).limit(limit);
    let result = favorites.map(element => {
        return {
            dishId: element.dishId,
            favorite: element.favorite,
            updatedAt: Date.parse(element.updatedAt),
        };
    });
    res.json(result);
});

router.put('/favorite/change', async(req, res) => {
    Logger.PUT('/favorite/change');
    const userId = '5eced428cb0ecd4bae119125';  // JWT
    const dishId = req.body.dishId;
    const favorite = req.body.favorite;
    const favoriteDish = await Favorite.findOne({userId: userId, dishId: dishId});
    if(!favoriteDish) {
        const fav = new Favorite({
            userId,
            dishId,
            favorite,
        });
        await fav.save();
        Logger.db('Favorite created!');
    } else {
        await Favorite.findOneAndUpdate({userId: userId, dishId: dishId}, {
            favorite: favorite,
        });
        Logger.db('Favorite update!');
    }; 
});

module.exports = router;