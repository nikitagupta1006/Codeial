const nodeMailer = require('../config/nodemailer');

module.exports.newComment = function(comment) {

    // renderTemplate is user defined function - which takes the context to be sent to the ejs and the relative path of the ejs file
    let htmlString = nodeMailer.renderTemplate({
        comment: comment
    }, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'nikidps@gmail.com',
        to: comment.user.email,
        subject: 'NEW COMMENT PUBLISHED!',
        html: htmlString

    }, function(err, info) {
        if (err) {
            console.log(`Could not send the email : ${err}`);
            return;
        }
        console.log('Mail delivered!', info);
        return;
    })
}

module.exports.deleteComment = function(comment) {

    let htmlString = nodeMailer.renderTemplate({
        comment: comment
    }, '/comments/delete_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'nikidps@gmail.com',
        to: comment.user.email,
        subject: 'COMMENT DELETED!',
        html: htmlString

    }, function(err, info) {
        if (err) {
            console.log(`Could not senf the mail! ${err}`);
            return;
        }
        console.log(`Mail delivered! ${info}`);
        return;
    });
}