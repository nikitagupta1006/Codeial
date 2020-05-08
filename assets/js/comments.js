function createComment(comment) {
    let newComment = `<li id="comment-${comment._id}">
            <div class="comment-content-container">
                ${comment.content}
                <a href="/comments/destroy/${comment._id}">
                    <span class="fa fa-times delete-comment-button"></span>
                </a>
            </div>
            <span> ${comment.user.name} </span>
            </li>`
    $(`#post-${comment.post} .display-comments-container>ul`).prepend(newComment);
    // add delete listener to the comment
}


// creation of new comments via delegation
$('#posts-list-container').on('click', '.post-comment-button', function(event) {
    event.preventDefault();
    $.ajax('/comments/create', {
            method: "POST",
            data: $(this).parent().eq(0).serialize()
        })
        .done((data) => {
            createComment(data.data.comment);
        }).fail(err => console.log(err));
});


// handle the deletion of comments
$('#posts-list-container').on('click', 'a', function(event) {
    event.preventDefault();
    let href = $(this).attr('href');
    $.ajax(`${href}`, {
            method: "GET"
        })
        .done((data) => {
            let comment = data.data.comment;
            $(`#comment-${comment._id}`).remove();
        })
        .fail(err => console.log(err))
})