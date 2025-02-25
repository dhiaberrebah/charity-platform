import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const blogPosts = [
  {
    id: 1,
    title: "The Impact of Clean Water on Communities",
    excerpt: "Discover how access to clean water transforms lives and communities around the world.",
    image: "https://source.unsplash.com/random/800x600/?water",
    date: "May 15, 2025",
  },
  {
    id: 2,
    title: "Education: A Path to Empowerment",
    excerpt: "Learn about the lasting effects of education on individuals and society as a whole.",
    image: "https://source.unsplash.com/random/800x600/?education",
    date: "May 10, 2025",
  },
  {
    id: 3,
    title: "Protecting Biodiversity: Why It Matters",
    excerpt: "Explore the importance of preserving Earth's diverse ecosystems and species.",
    image: "https://source.unsplash.com/random/800x600/?nature",
    date: "May 5, 2025",
  },
]

const BlogPreview = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed about our causes and the impact of your donations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-primary hover:text-primary-hover"
                >
                  Read more <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-hover"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogPreview

