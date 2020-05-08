const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');

// to be attached with nodemailer
let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = function(data, relativePath) {
    let mailHTML;
    ejs.renderFile(path.join(__dirname, '..', '/views/mailers', relativePath),
        data,
        function(err, template) {
            if (err) {
                console.log(`Error in rendering the template ${err}`);
                return;
            }
            mailHTML = template;
        }
    );
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}