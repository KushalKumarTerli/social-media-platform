// Home.js

import React, { useState, useEffect } from "react"
import axios from "axios"

function Home() {
  const [commentInput, setCommentInput] = useState("")
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios
      .get(`${process.env.APP_BACKEND_URL}/api/posts`)
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error))
  }, [])

  const handleLike = (postId) => {
    axios
      .post(`${process.env.APP_BACKEND_URL}/api/posts/like/${postId}`)
      .then((response) => {
        const updatedPosts = posts.map((post) =>
          post._id === postId ? response.data : post
        )
        setPosts(updatedPosts)
      })
      .catch((error) => console.error("Error liking post:", error))
  }

  const handleAddComment = (postId, commentText) => {
    axios
      .post(`${process.env.APP_BACKEND_URL}/api/posts/comment/${postId}`, {
        text: commentText,
      })
      .then((response) => {
        const updatedPosts = posts.map((post) =>
          post._id === postId ? response.data : post
        )
        setPosts(updatedPosts)
      })
      .catch((error) => console.error("Error adding comment:", error))
  }

  return (
    <div className="home">
      <h2>Recent Posts</h2>
      {posts.map((post) => {
        const { _id, title, content, file, likes, comments } = post
        return (
          <div key={_id} className="post">
            <h3>{title}</h3>
            <p>{content}</p>
            {file && (
              <div>
                {file.includes(".mp4") ? (
                  <video width="320" height="240" controls>
                    <source
                      src={`${process.env.APP_BACKEND_URL}/uploads/${file}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={`${process.env.APP_BACKEND_URL}/uploads/${file}`}
                    alt="Post Media"
                  />
                )}
              </div>
            )}
            <p>Likes: {likes}</p>
            <button onClick={() => handleLike(_id)}>Like</button>
            <p>Comments: {comments.length}</p>
            <ul>
              {comments.map((comment, index) => (
                <li key={index}>{comment.text}</li>
              ))}
            </ul>

            <input
              type="text"
              placeholder="Add a comment"
              className="comment-input"
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              onClick={() => handleAddComment(_id, commentInput)}
              className="comment-button"
            >
              Add Comment
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Home
