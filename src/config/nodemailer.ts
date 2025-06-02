import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    port: Number(process.env.MAIL_PORT),               // true for 465, false for other ports
    host: process.env.MAIL_NAME,
       auth: {
            user: process.env.MAIL_AUTH_USER,
            pass: process.env.MAIL_AUTH_PASS
         },
    secure: true,
    });


export {transporter}




