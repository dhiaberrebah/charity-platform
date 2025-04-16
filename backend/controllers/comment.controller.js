import Comment from "../models/comment.model.js"

export const createComment = async (req, res) => {
  try {
    const { content, causeId } = req.body
    const userId = req.user._id

    if (!content || !causeId) {
      return res.status(400).json({ message: "Content and causeId are required" })
    }

    const comment = new Comment({
      content,
      cause: causeId,
      user: userId,
    })

    await comment.save()

    // Populate user details before sending response
    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "nom prenom")

    res.status(201).json(populatedComment)
  } catch (error) {
    console.error("Error creating comment:", error)
    res.status(500).json({ message: error.message })
  }
}

export const getCauseComments = async (req, res) => {
  try {
    const { causeId } = req.params
    const comments = await Comment.find({ cause: causeId })
      .populate("user", "nom prenom")
      .sort({ createdAt: -1 })

    res.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    res.status(500).json({ message: error.message })
  }
}
