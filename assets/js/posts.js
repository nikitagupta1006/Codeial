function createPostDOM(post) {
    let newPost = `<li id="post-${post._id}">
    <div>
        <div class="post-content-container">
            <div class="content">
                ${post.content}
            </div>
            <div>
                <span class="fa fa-trash delete-post-button" data-post-id="${post._id}"></span>
            </div>
        </div>
        <div class="post-metadata">
            <div class="author">
                ${post.user.name}
            </div>
            <div>
                <div class="created-at">
                    Created At:
                    ${post['createdAt']}
                </div>
                <div class="updated-at">
                    Last Updated At:
                    ${post['updatedAt']}
                </div>
            </div>
        </div>
    </div>
    <div class="comments-container">
        <form method="POST" class="new-comment-form" action="/comments/create">
            <textarea rows="2" cols="30" placeholder="Write a comment..." name="content"></textarea>
            <input type="hidden" name="post" value="${post._id}">
            <input type="submit" class="post-comment-button" />
        </form>    
        <div class="display-comments-container">
            <ul>
            </ul>
        </div>
    </div>
</li>`;

    $('#posts-list-container').prepend(newPost);
}

// specific to the new post form
let createPost = function() {
    $('#new-post-form').on('submit', function(event) {
        event.preventDefault();
        $.ajax('/posts/create', {
                method: "POST",
                data: $(this).serialize(),
            })
            .done((data) => {
                console.log(data);
                createPostDOM(data.data.post);
            })
            .fail((err) => console.log(err))
    });
}

createPost();

// handle delete event using delegation on post
$('#posts-list-container').on('click', '.delete-post-button', function(event) {
    event.preventDefault();
    console.log("used ajax /posts/destroy");
    let id = this.getAttribute('data-post-id');
    $.ajax(`/posts/destroy/${id}`, {
        method: 'get',
    }).done((data) => {
        let id = data.data.post._id;
        $(`#post-${id}`).remove();
    }).fail(err => {
        console.log(`Error ${err}`);
    })
});