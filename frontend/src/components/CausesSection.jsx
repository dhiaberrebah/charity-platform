import CauseCard from "./CauseCard"

const CausesSection = () => {
  const featuredCauses = [
    {
      id: 1,
      title: "Clean Water Initiative",
      description:
        "Providing clean water to communities in need. Our projects have helped thousands of children access safe drinking water in schools and communities.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/african-schoolboy-at-school-smiles-drinking-water-2023-11-27-05-03-49-utc%20(1).jpg-Go6b2uSFCA284ZZvYpAg0digbPXuxu.jpeg",
      raised: 85000,
      goal: 100000,
    },
    {
      id: 2,
      title: "Education for All",
      description:
        "Supporting education in underprivileged areas through infrastructure development, teacher training, and student resources.",
      image: "src/assets/img/diverse-muslim-children-studying-in-classroom-2025-02-10-10-57-31-utc.jpg",
      raised: 45000,
      goal: 75000,
    },
    {
      id: 3,
      title: "Wildlife Conservation",
      description:
        "Protecting endangered species and their habitats through conservation efforts, anti-poaching initiatives, and community education.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/elephant-at-sunrise-in-thailand-2023-11-27-05-21-27-utc%20(1).jpg-Yro7XKZaIp3AHdxjmoEjeeDMESKI8j.jpeg",
      raised: 120000,
      goal: 150000,
    },
  ]

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Featured Causes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCauses.map((cause) => (
          <CauseCard
            key={cause.id}
            title={cause.title}
            description={cause.description}
            image={cause.image}
            raised={cause.raised}
            goal={cause.goal}
          />
        ))}
      </div>
    </div>
  )
}

export default CausesSection

