var nodemailer = require('nodemailer');

var alert_is_polling = true;
// poll_monitor(function () {
//     alert_is_polling = false;
// });

// setInterval(function () {
//     if (!alert_is_polling) {
//         alert_is_polling = true;
//         poll_monitor(function () {
//             alert_is_polling = false;
//         });
//     }
// }, 10000);

function poll_monitor(next) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport('smtp://aspmx.l.google.com');

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Guardian" <no-reply@example.com>', // sender address
        to: 'mitchell.pontague@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world 🐴', // plaintext body
        html: '<b>Hello world 🐴</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
    
    next();
}