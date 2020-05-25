import { AsyncRouter } from 'express-async-router';
const router = AsyncRouter();

router.get('/', async (req, res) => {
    res.status(400).send('Hello!');
    console.log('[GET] /api/auth/');
});

router.get('/user', async (req, res) => {
    res.send('Hello User!');
    console.log('[GET] /api/auth/user');
});

module.exports = router;