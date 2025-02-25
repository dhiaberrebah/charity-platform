import { Progress } from "@/components/ui/progress"

const CauseCard = ({ title, description, image, raised, goal }) => {
  const progress = (raised / goal) * 100

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="aspect-[4/3] relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 line-clamp-2">{description}</p>

        <div className="space-y-4">
          <Progress value={progress} className="h-2 bg-gray-100" />

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Raised: ${raised.toLocaleString()}</span>
            <span className="text-gray-600">Goal: ${goal.toLocaleString()}</span>
          </div>

          <button className="w-full py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors">
            Donate Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default CauseCard

