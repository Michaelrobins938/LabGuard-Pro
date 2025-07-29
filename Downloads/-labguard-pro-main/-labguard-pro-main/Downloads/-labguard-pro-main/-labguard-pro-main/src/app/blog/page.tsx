import { Metadata } from 'next'
import { BlogHero } from '@/components/blog/BlogHero'
import { BlogGrid } from '@/components/blog/BlogGrid'
import { BlogCTA } from '@/components/blog/BlogCTA'

export const metadata: Metadata = {
  title: 'Blog - LabGuard Pro | Latest Insights & Updates',
  description: 'Stay updated with the latest insights, research breakthroughs, and industry trends in laboratory management and AI technology.',
  keywords: 'blog, laboratory management, AI insights, research updates, industry trends',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <BlogHero />
      <BlogGrid />
      <BlogCTA />
    </div>
  )
} 