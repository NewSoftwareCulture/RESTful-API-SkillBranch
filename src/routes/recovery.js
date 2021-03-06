import { AsyncRouter } from 'express-async-router';
import bcrypt from 'bcryptjs';  
import models from '../models';
import { Logger } from '../utils';
import config from '../../config';

const router = AsyncRouter();

const { Code, User } = models;

var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.login,
    pass: config.email.password,
  }
});

async function codeGener() {
    return Math.floor(Math.random() * 900000) + 100000;
};
async function sendCode(email) {
    const code = String(await codeGener());
    Logger.work(`Recovery code: ${code}`);
    transporter.sendMail({
        from: config.email.login,
        to: email,
        subject: config.email.title,
        text: `Recovery code: ${code}`,
    });
    return code;
};

router.post('/auth/recovery/email', async(req, res) => {
    Logger.POST('/auth/recovery/email');
    const email = req.body.email;
    const recovery = await Code.findOne({email: email});
    const timeNow = Date.parse(new Date());
    if(!recovery) {
        const codeEmail = await sendCode(email);
        const code = new Code({
            email,
            code: codeEmail,
            time: timeNow,
        });
        await code.save();
        Logger.work('Code 200');
        return res.status(200).send();
    } else {
        if(timeNow - recovery.time > 3*60*1000) {
            const codeEmail = await sendCode(email);
            await Code.findOneAndUpdate({email: email}, {
                code: codeEmail,
                time: timeNow,
            });
            Logger.work('Code 200');
            return res.status(200).send();
        } else {
            Logger.work('Code 400');
            return res.status(400).send();
        };
    };
});

router.post('/auth/recovery/code', async(req, res) => {
    Logger.POST('/auth/recovery/code');
    const email = req.body.email;
    const code = req.body.code;
    const recovery = await Code.findOne({email: email});
    if (recovery) {
        if (code === recovery.code) {
            Logger.work('Code 200');
            return res.status(200).send();
        } else {
            Logger.work('Code 400');
            return res.status(400).send();
        };
    };
});

router.post('/auth/recovery/password', async(req, res) => {
    Logger.POST('/auth/recovery/password');
    const email = req.body.email;
    const code = req.body.code;
    const salt = bcrypt.genSaltSync(10);
    const newPassword = bcrypt.hashSync(req.body.password, salt);
    const recovery = await Code.findOne({email: email, code: code});
    const timeNow = Date.parse(new Date());
    if (recovery) {  
        if(timeNow - recovery.time <= 3*60*1000) {  //Срок действия кода - 3 минуты
            await User.findOneAndUpdate({email: email}, {
                password: newPassword,
            });  
            Logger.work('Code 200');
            res.status(200).send();
        } else {
            Logger.work('Code 402');
            res.status(402).send();
        };   
    };
});

module.exports = router;