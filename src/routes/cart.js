import { AsyncRouter } from 'express-async-router';
import Promise from 'bluebird';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const Cart = models.Cart;
const Dish = models.Dish;
const Promo = models.Promo;

// TODO: 
// StatusCode
// JWT
router.get('/cart', async(req, res) => {
    const userId = process.env.USERID || '5eced428cb0ecd4bae119125'; //JWT
    const cart = await Cart.findOne({userId: userId});
    if(cart) {
        const result = {
            promocode: cart.promocode,
            promotext: cart.promotext,
            total: cart.total,
            items: cart.items,
        };
        res.json(result);
    } else {
        Logger.ERROR('Cart not found');
    }
});

async function getPromo(promocode) {
    const promo = await Promo.findOne({promocode: promocode});
    if(!promo) return {promocode: '', promotext: ''};
    return { promocode: promo.promocode, promotext: promo.promotext };
};

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

router.put('/cart', async(req, res) => {
    Logger.PUT('/cart');
    const userId = process.env.USERID || '5eced484cb0ecd4bae119127'; // JWT
    const cart = await Cart.findOne({userId: userId});
    const code = req.body.promocode || '';
    const promo = promocode != '' ? await getPromo(code) : '';
    const promotext = promo.promotext;
    const promocode = promo.promocode;
    
    let total = 0;
    let items = [];
    let flag = true;
    
    Promise.each(req.body.items, async (element) => {
        if(await checkDishId(element.id) && await checkDish(element.id)){
            const dish = await Dish.findOne({_id: element.id});
            const amount = Number(element.amount) || 1;
            const price = dish.price;
            total += price * amount;
            const result = {
                id: element.id,
                amount: amount,
                price: price,
            };
            items.push(result);
        } else {
            flag = false;
        }
    }).then(async () => {
            if (cart != null && flag) await Cart.deleteOne({_id: cart._id});
    }).then(async () => {
        if(flag) {
            const updCart = new Cart({
                userId: userId,
                promocode: promocode,
                promotext: promotext,
                total: total,
                items: items,
            });
            await updCart.save();
            Logger.db('Update cart!');
        };
    });
});

module.exports = router;