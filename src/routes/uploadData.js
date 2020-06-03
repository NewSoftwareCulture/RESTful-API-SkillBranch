import { AsyncRouter } from 'express-async-router';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import fs from 'fs';
import models from '../models';
import { Logger } from '../utils';

const router = AsyncRouter();

const Category = models.Category;
const Dish = models.Dish;

const dataCategories = require('../data/categories/Categories.json');

async function checkCategoryId(id) {
    const category = await Category.findOne({category: id});
    if(!category) return true;
    return false;
};

async function uploadCategory() {
    await Promise.each(dataCategories, async (element) => {
        if (await checkCategoryId(element.id)) {
            const categoryId = await mongoose.Types.ObjectId();
            const findParent = await Category.findOne({category: element.parent});
            const parent = findParent ? findParent.categoryId : element.parent;
            const category = new Category({
                categoryId: categoryId, 
                category: element.id,
                name: element.name,
                order: element.order,
                icon: element.icon,
                parent: parent,
                active: element.active,
            });
            await category.save();
            Logger.db(`Category "${element.id}" created!`)
        };
    });
}

async function checkDishName(name) {
    const dish = await Dish.findOne({dishName: name});
    if(!dish) return true;
    return false;
};
async function uploadDish(dataDishes) {
    await Promise.each(dataDishes, async (element) => {
        if (await checkDishName(element.name)) {
            const findCategory = await Category.findOne({category: element.category});
            const dish = new Dish({
                dishName: element.name,
                description: element.description,
                image: element.image,
                isPromo: element.isPromo,
                isRecomendation: element.isRecomendation,
                oldPrice: element.oldPrice,
                price: element.price,
                rating: element.rating,
                likes: element.likes,
                commentsCount: 0,
                categoryId: findCategory.categoryId,
                active: element.active
            });
            await dish.save();
            Logger.db(`Dish "${element.name}" created!`);
        };
    });
}

async function uploadDishes() {
    const dir = fs.readdirSync('./src/data/dishes/');
    await Promise.each(dir, async(file) => {
        await uploadDish(await require(`../data/dishes/${file}`));
    });
};

router.get('/api/upload_data', async(req, res) => {
    Logger.GET('/api/upload_data');
    await uploadCategory();
    await uploadDishes();
});

module.exports = router;