import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
const router = AsyncRouter();

const User = models.User;

router.post('/auth/login', async(req, res) => {

})



module.exports = router;