import { AsyncRouter } from 'express-async-router';
import fs from 'fs';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const Category = models.Category;
const Dish = models.Dish;

const dataCategories = require('../data/categories/Categories.json');

async function checkCategoryId(id) {
    const category = await Category.findOne({categoryId: id});
    if(!category) return true;
    return false;
};

async function uploadCategory() {
    dataCategories.forEach(async (element) => {
        if (await checkCategoryId(element.id)) {
            const category = new Category({
                categoryId: element.id,
                name: element.name,
                order: element.order,
                icon: element.icon,
                parent: element.parent,
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
    dataDishes.forEach(async (element) => {
        if (await checkDishName(element.name)) {
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
                categoryId: element.category,
                active: element.active
            });
            dish.save();
            Logger.db(`Dish "${element.name}" created!`);
        };
    });
}

async function uploadDishes() {
    const dir = fs.readdirSync('./src/data/dishes/');
    dir.forEach(async(file) => {
        uploadDish(await require(`../data/dishes/${file}`));
    });
};

router.get('/api/upload_data', async(req, res) => {
    Logger.GET('/api/upload_data');
    await uploadCategory();
    await uploadDishes();
});

module.exports = router;