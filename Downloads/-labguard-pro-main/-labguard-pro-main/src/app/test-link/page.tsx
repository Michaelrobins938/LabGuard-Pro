export default function TestLinkPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Test Link Works!</h1>
        <p className="text-gray-300">If you can see this, routing is working.</p>
        <a href="/" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          Go back home
        </a>
      </div>
    </div>
  )
}