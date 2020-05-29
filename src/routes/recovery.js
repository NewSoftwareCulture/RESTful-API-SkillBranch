import { AsyncRouter } from 'express-async-router';
import models from '../models/models';
import Logger from './Logger';

const router = AsyncRouter();

const Code = models.Code;
const User = models.User;

var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'yandex',
  auth: {
    user: process.env.LOGIN_EMAIL || 'testermajler@yandex.ru',
    pass: process.env.PASS_EMAIL || '12345678test'
  }
});

async function codeGener() {
    return Math.floor(Math.random() * 900000) + 100000;
};
async function sendCode(email) {
    const code = String(await codeGener());
    Logger.work(`Recovery code: ${code}`);
    transporter.sendMail({
        from: process.env.LOGIN_EMAIL || 'testermajler@yandex.ru',
        to: email,
        subject: 'Recovery code Skillbranch',
        text: code,
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
        res.status(200);
    } else {
        if(timeNow - recovery.time > 3*60*1000) {
            const codeEmail = await sendCode(email);
            await Code.findOneAndUpdate({email: email}, {
                code: codeEmail,
                time: timeNow,
            });
            Logger.work('Code 200');
            res.status(200);
        } else {
            Logger.work('Code 400');
            res.status(400);
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
            res.status(200);
        } else {
            Logger.work('Code 400');
            res.status(400);
        };
    };
});
// (en)cript password
router.post('/auth/recovery/password', async(req, res) => {
    Logger.POST('/auth/recovery/password');
    const email = req.body.email;
    const code = req.body.code;
    const newPassword = req.body.password;
    const recovery = await Code.findOne({email: email, code: code});
    const timeNow = Date.parse(new Date());
    if (recovery) {  
        if(timeNow - recovery.time <= 3*60*1000) {  //Срок действия кода - 3 минуты
            await User.findOneAndUpdate({email: email}, {
                password: newPassword,
            });  
            Logger.work('Code 200');
            res.status(200);
        } else {
            Logger.work('Code 402');
            res.status(402);
        };
          
    }
});

module.exports = router;