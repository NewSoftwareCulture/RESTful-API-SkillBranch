import { AsyncRouter } from 'express-async-router';
import Logger from './Logger';

const router = AsyncRouter();

async function parseAddress(address, res) {
    const cityRe = new RegExp("[А-яA-z]+");
    const streetRe = new RegExp("(ул|улица|st|street).? [А-яA-z]+");
    const houseRe = new RegExp("[0-9]+");
    const city = address.match(cityRe) ? address.match(cityRe)[0] : null;
    const street = address.match(streetRe) ? address.match(streetRe)[0] : null;
    const house = address.match(houseRe) ? address.match(houseRe)[0] : null;
    res.json({
        city,
        street,
        house,
    });
};

router.post('/address/input', async(req, res) => {
    Logger.POST('/address/input');
    const address = req.body.address;
    await parseAddress(address, res);
});
// Добавить токен авторизации
router.post('/address/coordinates', async(req, res) => {
    Logger.POST('/address/coordinates');
    const lat = req.body.lat || '55.757692';
    const lon = req.body.lon || '37.612067';
    var request = require('request');
    await request({
        method: 'POST',
        url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address',
        headers: {
            'Content-Type': 'application/json'
    },
        body: `{  \"lat\": ${lat},  \"lon\": ${lon}}`
    }, async (error, response, body) => {
        console.log('Status:', response.statusCode);
        console.log('Headers:', JSON.stringify(response.headers));
        console.log('Response:', body);
        const address = body.suggestions[0].value;
        await parseAddress(address, res);
    });
});

module.exports = router;