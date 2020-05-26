import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Promise from 'bluebird';
import cors from 'cors';
import middleware from './middlewares/index';
import Logger from './middlewares/Logger';
// import models from './models/models';

process.env.URI = "mongodb://localhost:27017/skillbranch_db";
process.env.__MODE__ = 'DEV';

const uri = process.env.URI;

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

app.use('/api/auth', middleware.auth);

app.use(middleware.login);

app.listen(3000, () => {
    Logger('Example app listening on port 3000!\n ________________________\n|                        |\n| http://localhost:3000/ |\n|________________________|\n');
});