export function ResearchImpactStats() {
  const impactStats = [
    {
      metric: "150+",
      label: "Biomedical Tools",
      description: "Specialized analysis tools integrated"
    },
    {
      metric: "59",
      label: "Scientific Databases",
      description: "Connected research databases"
    },
    {
      metric: "105",
      label: "Software Packages",
      description: "Bioinformatics tools available"
    },
    {
      metric: "200+",
      label: "Global Contributors",
      description: "Researchers worldwide"
    }
  ]

  return (
    <div className="bg-blue-900 text-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Research Impact by the Numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {impactStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-300 mb-2">
                {stat.metric}
              </div>
              <div className="text-lg font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-blue-200">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 