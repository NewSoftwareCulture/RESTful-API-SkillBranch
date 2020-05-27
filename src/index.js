import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Promise from 'bluebird';
import cors from 'cors';
import middlewares from './middlewares/index';
import Logger from './middlewares/Logger';

const uri = "mongodb://localhost:27017/skillbranch_db";

mongoose.Promise = Promise;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        Logger.db('Connected!');
    })
    .catch(e => {
        Logger.ERROR(e);
    })

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(middlewares.login);
app.use(middlewares.register);
app.use(middlewares.recovery);
app.use(middlewares.refresh);
app.use(middlewares.changePassword);
app.use(middlewares.favorite);
app.use(middlewares.recommended);
app.use(middlewares.categories);
app.use(middlewares.dishes);
app.use(middlewares.reviews);
app.use(middlewares.cart);
app.use(middlewares.check);
app.use(middlewares.orders);
app.use(middlewares.uploadData);

app.listen(3000, () => {
    Logger('Example app listening on port 3000!\n ________________________\n|                        |\n| http://localhost:3000/ |\n|________________________|\n');
});