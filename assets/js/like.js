$('#posts-list-container').on('click', '.post-like-button', function() {
    $(this).toggleClass('red');
    // send ajax request to toggle like
    let id = $(this).parent().parents()[0].getAttribute('id').replace('post-', '');
    $.ajax('/likes/toggle', {
        method: "POST",
        data: {
            type: 'Post',
            id: id
        },
        success: (data) => {
            // using the arrow function to maintain reference to this => post-like-button
            // otherwise in the success function, it refers to the jqxhr object
            let count = parseInt($(this).siblings('.num-likes').eq(0).text());
            console.log(count);
            if (data.data.deleted) {
                // decrement the count
                $(this).siblings('.num-likes').eq(0).text(count - 1);
            } else {
                // increment the count
                $(this).siblings('.num-likes').eq(0).text(count + 1);
            }

        }
    })
});

$('#posts-list-container').on('click', '.comment-like-button', function() {
    $(this).toggleClass('red');
    // send ajax request to toggle like
    let id = $(this).parent().parents()[0].getAttribute('id').replace('comment-', '');
    $.ajax('/likes/toggle', {
        method: "POST",
        data: {
            type: 'Comment',
            id: id
        },
        sucess: function(data) {
            console.log(data);
        }
    })
});


document.querySelectorAll('#posts-list-container>li').forEach(function(listitem) {
    let postId = listitem.getAttribute('id').replace('post-', '');
    // fetch the likes on the post
    $.ajax('/likes', {
        method: "GET",
        data: {
            type: "Post",
            id: postId
        },
        success: function(data) {
            let likes = data.data.likes;
            $(`#post-${postId} .num-likes`).text(likes);
        }
    }).fail(err => console.log(`Error in fetching likes of posts ${err}`));

    // fetch likes on each of the comments
    document.getElementById(`post-${postId}`).querySelectorAll(`.display-comments-container li`).forEach(function(commentItem) {
        let commentId = commentItem.getAttribute('id').replace('comment-', '');
        $.ajax('/likes', {
            method: "GET",
            data: {
                type: "Comment",
                id: commentId
            },
            success: function(data) {
                console.log(data);
            }
        }).fail(err => console.log(`Error in fetching likes of comments ${err}`));
    })


});