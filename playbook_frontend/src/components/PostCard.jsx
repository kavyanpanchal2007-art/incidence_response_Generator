function PostCard({ post, onUpvote }) {
  return (
    <article className="post-card">
      <header className="post-card__header">
        <div>
          <h2>{post.title}</h2>
          <p>By {post.username}</p>
        </div>

        <span className="post-card__rating">
          👍 {post.rating}
        </span>
      </header>

      <div className="post-card__meta">
        <span>{post.attack_name}</span>
      </div>

      <div className="post-card__content-wrapper">
        <p className="post-card__content">
          {post.content}
        </p>
      </div>

      <div className="post-card__footer">
        <button
          className="post-card__upvote"
          type="button"
          onClick={() => onUpvote(post._id)}
        >
          👍 Upvote
        </button>
      </div>
    </article>
  );
}

export default PostCard;