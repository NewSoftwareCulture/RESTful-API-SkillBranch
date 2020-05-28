import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Promise from 'bluebird';
import cors from 'cors';
import routes from './routes/index';
import Logger from './routes/Logger';

const uri = "mongodb://localhost:27017/skillbranch_db";
const port = process.env.PORT || 3000;

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

app.use(routes.login);
app.use(routes.register);
app.use(routes.recovery);
app.use(routes.refresh);
app.use(routes.changePassword);
app.use(routes.favorite);
app.use(routes.recommended);
app.use(routes.categories);
app.use(routes.dishes);
app.use(routes.reviews);
app.use(routes.cart);
app.use(routes.check);
app.use(routes.orders);
app.use(routes.uploadData);

app.listen(port, () => {
    Logger(`Example app listening on port ${port}!\n ________________________\n|                        |\n| http://localhost:${port}/ |\n|________________________|\n`);
});