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
    const userId = '5eced428cb0ecd4bae119125'; //JWT
    const cart = await Cart.findOne({userId: userId});
    const result = {
        promocode: cart.promocode,
        promotext: cart.promotext,
        total: cart.total,
        items: cart.items,
    };
    res.json(result);
});

async function getPromo(promocode) {
    const promo = await Promo.findOne({promocode: promocode});
    if(!promo) return {promocode: '', promotext: ''};
    return { promocode: promo.promocode, promotext: promo.promotext };
};

router.put('/cart', async(req, res) => {
    Logger.PUT('/cart');
    const userId = '5eced484cb0ecd4bae119127'; // JWT
    const cart = await Cart.findOne({userId: userId});
    const code = req.body.promocode || '';
    const promo = promocode != '' ? await getPromo(code) : '';
    const promotext = promo.promotext;
    const promocode = promo.promocode;
    
    let total = 0;
    let items = [];
    
    Promise.each(req.body.items, async (element) => {
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
    }).then(async () => {
            if (cart != null) await Cart.deleteOne({_id: cart._id});
    }).then(async () => {
        const updCart = new Cart({
            userId: userId,
            promocode: promocode,
            promotext: promotext,
            total: total,
            items: items,
        });
        await updCart.save();
        Logger.db('Update cart!');
    });
});

module.exports = router;