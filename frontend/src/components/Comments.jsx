import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { toast } from "sonner"

const Comments = ({ causeId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/comments/cause/${causeId}`)
      if (!response.ok) throw new Error("Failed to fetch comments")
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast.error("Failed to load comments")
    }
  }

  useEffect(() => {
    fetchComments()
  }, [causeId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5001/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
        body: JSON.stringify({
          content: newComment,
          causeId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to post comment")
      }

      const data = await response.json()
      setComments((prev) => [data, ...prev])
      setNewComment("")
      toast.success("Comment posted successfully")
    } catch (error) {
      console.error("Error posting comment:", error)
      toast.error(error.message || "Failed to post comment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Comments</h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder-gray-400"
            rows="3"
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-white/70 mb-6">Please log in to post comments.</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white/10 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">
                {comment.user.prenom} {comment.user.nom}
              </span>
              <span className="text-sm text-gray-300">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-white/90">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-white/50">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}

export default Comments
