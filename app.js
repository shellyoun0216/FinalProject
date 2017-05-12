var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);
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
        res.sendStatus(500);
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
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    }
});

app.listen(process.env.PORT||3000, function () {
    console.log('Example app listening on port 3000!')
})