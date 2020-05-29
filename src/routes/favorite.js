import { AsyncRouter } from 'express-async-router';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const Favorite = models.Favorite;
const Dish = models.Dish;

// TODO: JWT
// StatusCode
router.get('/favorite?:offset?:limit', async(req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/favorite?offset=${offset}&limit=${limit}`);
    const userId = process.env.USERID || '5eced428cb0ecd4bae119125';  // JWT
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

async function checkDishId(dishId){
    Logger.work('Check Id');
    if(dishId.length === 24) return true;
    Logger.ERROR('Type DishId not ObjectId');
    return false;
}

async function checkDish(dishId) {
    Logger.work('Check dish');
    const dish = await Dish.findOne({_id: dishId});
    if(dish) return true;
    Logger.ERROR('Dish not found');
    return false;
};

router.put('/favorite/change', async(req, res) => {
    Logger.PUT('/favorite/change');
    const userId = process.env.USERID || '5eced428cb0ecd4bae119125';  // JWT
    const items = req.body;
    let flag = true;
    await Promise.each(items, async(element) => { 
        try {
            const dishId = element.dishId;
            if(await checkDishId(dishId) && await checkDish(dishId)){
                const dishId = element.dishId;
                const favorite = element.favorite;
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
            };
        } catch(e) {
            Logger.ERROR(e.message);
        };
    });
});

module.exports = router;