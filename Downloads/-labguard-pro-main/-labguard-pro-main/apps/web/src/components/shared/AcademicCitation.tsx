import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export function AcademicCitation() {
  const citation = {
    title: "Biomni: A General-Purpose Biomedical AI Agent",
    authors: "SNAP Lab Research Team",
    venue: "Stanford University",
    year: "2024",
    bibtex: `@article{biomni2024,
  title={Biomni: A General-Purpose Biomedical AI Agent},
  author={SNAP Lab Research Team},
  journal={Stanford University},
  year={2024},
  url={https://biomni.stanford.edu/}
}`
  }

  return (
    <Card className="bg-gray-50 border-l-4 border-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>Academic Citation</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">{citation.title}</h4>
            <p className="text-sm text-gray-600">
              {citation.authors} • {citation.venue} • {citation.year}
            </p>
          </div>
          
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
              Show BibTeX Citation
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
              {citation.bibtex}
            </pre>
          </details>
        </div>
      </CardContent>
    </Card>
  )
} 