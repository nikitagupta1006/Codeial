const queue = require('../config/kue');
const postsMailer = require('../mailers/posts_mailer');

queue.process('posts', async function(job, done) {

    try {
        await postsMailer.newPost(job.data.post);
        done();
    } catch (err) {
        console.log(`Error in sending mail: ${err}`);
        return;
    }

})