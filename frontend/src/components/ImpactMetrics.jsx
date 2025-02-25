import { Users, Droplet, BookOpen, TreePine } from "lucide-react"

const metrics = [
  { icon: Users, value: "1M+", label: "Lives Impacted" },
  { icon: Droplet, value: "500K", label: "Clean Water Access" },
  { icon: BookOpen, value: "250K", label: "Children Educated" },
  { icon: TreePine, value: "1M+", label: "Trees Planted" },
]

const ImpactMetrics = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Together, we've made a significant difference. Here's what we've achieved so far:
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <metric.icon className="w-12 h-12 text-white mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-white/80">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ImpactMetrics

