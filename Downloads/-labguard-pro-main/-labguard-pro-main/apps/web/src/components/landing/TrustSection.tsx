export function TrustSection() {
  const certifications = [
    { name: 'CAP Certified', logo: '/api/placeholder/120/60' },
    { name: 'CLIA Compliant', logo: '/api/placeholder/120/60' },
    { name: 'ISO 15189', logo: '/api/placeholder/120/60' },
    { name: 'HIPAA Compliant', logo: '/api/placeholder/120/60' },
    { name: 'SOC 2 Type II', logo: '/api/placeholder/120/60' },
    { name: 'FDA 21 CFR Part 11', logo: '/api/placeholder/120/60' }
  ]

  return (
    <section className="py-16 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-lg font-medium text-gray-400 mb-8">
            Trusted by leading laboratories and certified for enterprise compliance
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {certifications.map((cert, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 group">
              <div className="w-24 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <span className="text-xs font-medium text-gray-300">{cert.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 