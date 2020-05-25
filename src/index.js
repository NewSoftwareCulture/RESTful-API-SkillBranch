import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Promise from 'bluebird';
import cors from 'cors';
import middleware from './middlewares/index';
// import models from './models/models';

process.env.URI = "mongodb://localhost:27017/skillbranch_db";
const uri = process.env.URI;

mongoose.Promise = Promise;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('[Mongodb] Connected!');
    })
    .catch(e => {
        console.log(e);
    })

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', middleware.auth);

app.get('/', async(req, res) => {
    res.send('Hello World!');
    console.log('[GET] /')
});

// app.post('/data', async (req, res) => {
//     const data = req.body;
//     if (!data.user) return res.status(400).send('user required!');
//     // if (!data.pet) data.pets = [];
  
//     try {
//       const result = await saveDataInDb(data);
//       return res.json(result);
//     } catch (error) {
//       return res.status(500).json(error);
//     }
//   });

app.listen(3000, () => {
    console.log('Example app listening on port 3000!\n ________________________\n|                        |\n| http://localhost:3000/ |\n|________________________|\n');
});