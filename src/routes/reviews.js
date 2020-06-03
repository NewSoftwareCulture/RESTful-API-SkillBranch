import { AsyncRouter } from 'express-async-router';
import { hasUpdatedAtSince, getLastDate, Logger} from '../utils'; 
import authCheck from '../middleware/auth';
import models from '../models';

const router = AsyncRouter();

const { Review, Dish, User } = models;

router.get('/reviews/:dishId', async(req, res) => {
    const dishId = req.params.dishId;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/reviews?offset=${offset}&limit=${limit}`);
    const reviews = await Review.find({dishId: dishId}).skip(offset).limit(limit);
    if(!reviews) return res.status(200).json([]);

    let result = reviews.map(element => {
        return {
            id: element.reviewId,
            dishId: element.dishId,
            author: element.author,
            date: element.date,
            rating: element.rating,
            text: element.text,
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

async function ratingUpd(dishId, rating) {
    const dish = await Dish.findOne({_id: dishId});
    const reviews = await Review.find({dishId: dishId});

    const countReview = reviews ? reviews.length : 0;
    return ((countReview * dish.rating) + rating) / (countReview + 1);
};

async function updCountComments(dishId){
    const dish = await Dish.findById(dishId);
    const count = dish.commentsCount + 1;
    await Dish.findByIdAndUpdate(dishId, {
        commentsCount: count,
    });
};

router.post('/reviews/:dishId', authCheck, async(req, res) => {
    const dishId = req.params.dishId;
    Logger.POST(`/reviews/${dishId}`);
    if(await checkDishId(dishId) && await checkDish(dishId)){
        const rating = req.body.rating;
        const text = req.body.text;
        const userId = req.user._id;
        const user = await User.findOne({_id: userId});
        const author = user.firstName + ' ' + user.lastName;
        const date = new Date().toISOString();
        const active = true;

        if (text) updCountComments(dishId);

        const newRating = await ratingUpd(dishId, rating);
        await Dish.findOneAndUpdate({_id: dishId}, {
            rating: newRating,
        });
        Logger.db('Rating updated!');

        const review = new Review({
            dishId,
            author,
            date,
            rating,
            text,
            active,
        });
        await review.save();
        Logger.db('Review created!');
        return res.status(201).send();
    } else {
        return res.status(402).send();
    };
});

module.exports = router;