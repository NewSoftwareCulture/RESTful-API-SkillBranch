import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const Category = models.Category;

// TODO: 'If-Modified-Since'
router.get('/categories?:offset?:limit', async(req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/categories?offset=${offset}&limit=${limit}`);
    const category = await Category.find().skip(offset).limit(limit);
    let result = category.map(element => {
        return {
            categoryId: element.categoryId,
            name: element.name,
            order: element.order,
            icon: element.icon,
            parent: element.parent,
            active: element.active,
            createdAt: Date.parse(element.createdAt),
            updatedAt: Date.parse(element.updatedAt),
        };
    });
    res.json(result);
});

module.exports = router;