import nodemailer from 'nodemailer';

export default async (to, subject, html) =>{ 
   
    const transport = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
           user: process.env.EMAIL_USERNAME,
           pass: process.env.EMAIL_PASSWORD
        }
        
   });
   
    transport.sendMail({
        to,
        subject,
        from: `"Jorge Rufus" <${process.env.EMAIL_USERNAME}>`,
        html
    });

}
