import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const Review = models.Review;

// TODO: 'If-Modified-Since'
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
            createdAt: element.createdAt,
            updatedAt: element.updatedAt,
        };
    });
    res.json(result);
});

// TODO: StatusCode, JWT
router.post('/reviews/new', async(req, res) => {
    Logger.POST('/reviews/new');
    const dishId = req.body.dishId;
    const rating = req.body.rating;
    const text = req.body.text;
    const author = 'Vlad'; // JWT
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
});

module.exports = router;