const queue = require('../config/kue');
const commentsMailer = require('../mailers/comments_mailer');

queue.process('emails', async function(job, done) {

    try {
        await commentsMailer.newComment(job.data.comment);
        done();
    } catch (err) {
        console.log(`Error in sending the mail: ${err}`);
        done(err);
    }

});