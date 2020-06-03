import { AsyncRouter } from 'express-async-router';
import Promise from 'bluebird';
import authCheck from '../middleware/auth';
import models from '../models';
import { Logger } from '../utils';

const router = AsyncRouter();

const { Cart, Dish, Promo } = models;

router.get('/cart', authCheck, async(req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({userId: userId});
    if(cart) {
        const result = {
            promocode: cart.promocode,
            promotext: cart.promotext,
            total: cart.total,
            items: cart.items,
        };
        return res.status(200).json(result);
    } else {
        Logger.ERROR('Cart not found');
        return res.status(402).send();
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

router.put('/cart', authCheck, async(req, res) => {
    Logger.PUT('/cart');
    const userId = req.user._id;
    const code = req.body.promocode || '';
    const promo = promocode != '' ? await getPromo(code) : '';
    const promotext = promo.promotext;
    const promocode = promo.promocode;
    
    let total = 0;
    let items = [];
    
    await Promise.each(req.body.items, async (element) => {
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
            return res.status(400).send();
        };
    });
    
    const cart = await Cart.findOne({userId: userId});
    if (!cart) {
        const updCart = new Cart({
            userId: userId,
            promocode: promocode,
            promotext: promotext,
            total: total,
            items: items,
        });
        await updCart.save();
        Logger.db('Save cart!');
        const newCart = await Cart.findById(cart._id);
        return res.status(202).json({
            promocode: newCart.promocode,
            promotext: newCart.promotext,
            total: newCart.total,
            items: newCart.items,
        });
    }
    await Cart.findByIdAndUpdate(cart._id, {
        promocode: promocode,
        promotext: promotext,
        total: total,
        items: items,
    });  
    Logger.db('Update cart!');
    const newCart = await Cart.findById(cart._id);
    return res.status(202).json({
        promocode: newCart.promocode,
        promotext: newCart.promotext,
        total: newCart.total,
        items: newCart.items,
    });
});

module.exports = router;