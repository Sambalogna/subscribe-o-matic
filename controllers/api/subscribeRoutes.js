const router = require('express').Router();
const { Subscribe, User } = require('../../models');
const withAuth = require('../../utils/auth');
const nodemailer = require('nodemailer');
require('dotenv').config();
// POST route to create a new subscription
router.post('/', withAuth, async (req, res) => {
    try {
        const newSubscribe = await Subscribe.create({
            user_id: req.session.user_id,  
       
            team_id: req.body.team_id
        });
        
        const userData = await User.findByPk(req.session.user_id, {
            attributes: {exclude: ['password']},
        })
        const user = userData.get({plain: true});
       
        console.log(user)
        //NodeMailer function here: email is sent when button is clicked
        async function main() {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASSWORD
                }
            });
            let info = await transporter.sendMail({
                from: '"Subscribe-O-Matic" <subscribeomaticmailer@gmail.com>',
                to: user.email,
                subject: "You are Subscribed!",
                text: "Subscriptions via nodemailer",
                html: "<b>You are subscribed!</b>",
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } main().catch(console.error);
        
        res.status(200).json(newSubscribe);
    } catch (err) {
        res.status(400).json(err); 
    }
});

module.exports = router; 