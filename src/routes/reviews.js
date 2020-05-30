import { AsyncRouter } from 'express-async-router';
import passport from 'passport';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const Review = models.Review;
const Dish = models.Dish;
const User = models.User;

// TODO: 'If-Modified-Since'
// StatusCode
router.get('/reviews?:offset?:limit', async(req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/reviews?offset=${offset}&limit=${limit}`);
    const reviews = await Review.find().skip(offset).limit(limit);
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

router.post('/reviews/new', passport.authenticate('jwt', {session: false}), async(req, res) => {
    Logger.POST('/reviews/new');
    const dishId = req.body.dishId;
    if(await checkDishId(dishId) && await checkDish(dishId)){
        const rating = req.body.rating;
        const text = req.body.text;
        const userId = req.user._id;
        const user = await User.findOne({_id: userId});
        const author = user.firstName + ' ' + user.lastName;
        const date = new Date();
        const active = true;
        const review = new Review({
            dishId,
            rating,
            text,
            author,
            date,
            active,
        });
        await review.save();
        Logger.db('Review created!');
        res.status(201);
    };
});

module.exports = router;