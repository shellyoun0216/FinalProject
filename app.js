var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
var helper = require('sendgrid').mail;
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.post('/', function (req, res) {
    var emailAddress = req.body.email;
    var emailMessage = req.body.message;
    if (!emailAddress && !emailMessage) {
        res.send('No Email and/or Message Supplied');
    } else {
        var fromEmail = new helper.Email(emailAddress);
        var toEmail = new helper.Email('shellyoun0216@gmail.com');
        var subject = 'Contact from my Final Project Website';
        var content = new helper.Content('text/plain', emailMessage);
        var mail = new helper.Mail(fromEmail, subject, toEmail, content);

        var request = sendgrid.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });
        sendgrid.API(request, function(error, response) {
            if (error) {
                res.send('An error occurred');
            } else {
                res.send('Email Sent');
            }
        });
    }
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})