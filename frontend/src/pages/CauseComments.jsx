"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import NavigationBar from "../components/NavigationBar"
import UserNavigationBar from "../components/UserNavigationBar"
import AdminNavbar from "../components/AdminNavbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { format } from "date-fns"

const CauseComments = () => {
  const { id } = useParams()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cause, setCause] = useState(null)
  const { isAuthenticated, isAdmin, user } = useAuth()

  // Determine which navbar to show based on auth state
  let NavbarComponent = NavigationBar
  if (isAdmin) {
    NavbarComponent = AdminNavbar
  } else if (isAuthenticated) {
    NavbarComponent = UserNavigationBar
  }

  useEffect(() => {
    fetchCause()
    fetchComments()
  }, [id])

  const fetchCause = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/causes/${id}`)
      if (!response.ok) throw new Error("Failed to fetch cause")
      const data = await response.json()
      setCause(data)
    } catch (error) {
      console.error("Error fetching cause:", error)
      toast.error("Failed to load cause details")
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/comments/cause/${id}`)
      if (!response.ok) throw new Error("Failed to fetch comments")
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast.error("Failed to load comments")
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5001/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: newComment,
          causeId: id,
        }),
      })

      if (!response.ok) throw new Error("Failed to post comment")

      setNewComment("")
      toast.success("Comment posted successfully")
      fetchComments() // Refresh comments
    } catch (error) {
      console.error("Error posting comment:", error)
      toast.error("Failed to post comment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <NavbarComponent />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl p-6"
        >
          {cause && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{cause.title}</h1>
              <p className="text-gray-600">{cause.description}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            
            {isAuthenticated && (
              <form onSubmit={handleSubmitComment} className="mb-6">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this cause..."
                  className="mb-2"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !newComment.trim()}
                  className="w-full"
                >
                  {isLoading ? "Posting..." : "Post Comment"}
                </Button>
              </form>
            )}

            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-600">
                      {comment.user.prenom} {comment.user.nom}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(comment.createdAt), "PPP")}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </motion.div>
              ))}
              
              {comments.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CauseComments