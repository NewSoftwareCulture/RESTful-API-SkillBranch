import { AsyncRouter } from 'express-async-router';
import models from '../models';
import { hasUpdatedAtSince, getLastDate, Logger } from '../utils'; 


const router = AsyncRouter();

const { Category } = models;

router.get('/categories', async(req, res) => {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    Logger.GET(`/categories?offset=${offset}&limit=${limit}`);
    const category = await Category.find().skip(offset).limit(limit);
    if (!category) return res.status(200).json([]);

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

    const lastDate = await getLastDate(result);
    res.setHeader('Last-Modified', lastDate);

    if (!hasUpdatedAtSince(result, req.headers['if-modified-since'])) return res.status(304).send();
    return res.status(200).json(result);
});

module.exports = router;