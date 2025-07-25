export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          LabGuard Pro - Test Page
        </h1>
        <p className="text-lg text-gray-600">
          If you can see this page, the deployment is working correctly!
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Deployment successful at {new Date().toISOString()}
        </p>
      </div>
    </div>
  )
} 