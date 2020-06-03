import { AsyncRouter } from 'express-async-router';
import Promise from 'bluebird';
import { hasUpdatedAtSince, getLastDate, Logger } from '../utils'; 
import authCheck from '../middleware/auth';
import models from '../models';

const router = AsyncRouter();

const { Favorite,Dish } = models;

router.get('/favorite', authCheck, async (req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/favorite?offset=${offset}&limit=${limit}`);
    const userId = req.user._id;
    const favorites = await Favorite.find({ userId: userId, favorite: true }).skip(offset).limit(limit);
    const favCheckUpd = await Favorite.find({ userId: userId }).skip(offset).limit(limit);
    if (!favorites) return res.status(402).send();
    
    let checkUpd = favCheckUpd.map(element => ({
        updatedAt: Date.parse(element.updatedAt),
    }));
    
    const lastDate = await getLastDate(checkUpd);
    res.setHeader('Last-Modified', lastDate);

    if (!hasUpdatedAtSince(checkUpd, req.headers['if-modified-since'])) return res.status(304).send([]);

    let result = favorites.map(element => ({
        dishId: element.dishId,
        favorite: element.favorite,
        updatedAt: Date.parse(element.updatedAt),
    }));
    return res.status(200).json(result);
});

async function checkDishId(dishId){
    Logger.work('Check Id');
    if(dishId.length === 24) return true;
    Logger.ERROR('Type DishId not ObjectId');
    return false;
}

async function checkDish(dishId) {
    Logger.work('Check dish');
    const dish = await Dish.findOne({ _id: dishId });
    if (dish) return true;
    Logger.ERROR('Dish not found');
    return false;
};

router.put('/favorite/change', authCheck, async(req, res) => {
    Logger.PUT('/favorite/change');
    const userId = req.user._id;
    const items = req.body;
    let flag = true;

    await Promise.each(items, async (element) => { 
            const dishId = element.dishId;
            if(await checkDishId(dishId) && await checkDish(dishId)){ // TODO: оптимизировать
                const dishId = element.dishId;
                
                const favorite = element.favorite;
                const dish = await Dish.findOne({_id: dishId});
                const favoriteDish = await Favorite.findOne({userId: userId, dishId: dishId});

                let likesDish;
                if (!favoriteDish && favorite) { likesDish = dish.likes + 1; } 
                else if (favoriteDish && favorite && favoriteDish.favorite === false) { likesDish = dish.likes + 1; } 
                else if (favoriteDish && !favorite && favoriteDish.favorite) { likesDish = dish.likes - 1; } 
                else { likesDish = dish.likes; }
                
                await Dish.findByIdAndUpdate(dishId, { likes: likesDish });

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
                res.status(202);
            } else {
                res.status(402);
            }
        }).catch(err => {
            Logger.ERROR(err.message);
    });
});

module.exports = router;