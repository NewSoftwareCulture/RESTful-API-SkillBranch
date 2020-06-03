import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Promise from 'bluebird';
import cors from 'cors';
import passport from 'passport';
import routes from './routes/index';
import Logger from './utils/Logger';
import config from '../config';

const uri = config.db.uri;
const port = config.port;
console.log(process.env)

mongoose.Promise = Promise;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    .then(() => {
        Logger.db('Connected!');
    })
    .catch(e => {
        Logger.ERROR(e);
    })

const app = express();
app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(bodyParser.json());
app.use(cors());

app.use(routes.login);
app.use(routes.register);
app.use(routes.recovery);
app.use(routes.refresh);
app.use(routes.profile);
app.use(routes.favorite);
app.use(routes.recommended);
app.use(routes.categories);
app.use(routes.dishes);
app.use(routes.reviews);
app.use(routes.cart);
app.use(routes.address);
app.use(routes.orders);
app.use(routes.uploadData);

app.get('/', async(req, res) => {
    res.status(200).send("It's alive!");
});

app.listen(port, () => {
    Logger(`Example app listening on port ${port}!\n ________________________\n|                        |\n| http://localhost:${port}/ |\n|________________________|\n`);
});