import React from "react";

const CommentList = ({ comments }) => {
    const renderedComments = comments.map(comment => {
        const content = contentByStatus(comment);
        return <li key={comment.id}>{content}</li>;
    })

    return <ul>
        {renderedComments}
    </ul>;
};

const contentByStatus = ({ status, content }) => {
    //todo switch and no status?
    if (status === 'approved') {
        return content;
    } else if (status === 'pending') {
        return 'This comment is awaiting moderation.';
    } else if (status === 'rejected') {
        return 'This comment is rejected.';
    }
}

export default CommentList;