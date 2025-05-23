import { SeedButton } from "@/components/admin/seed-button"
import { SetupDatabase } from "@/components/admin/setup-database"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Co.Property</h1>
          <p className="mt-3 text-xl text-gray-600">Comprehensive property management for luxury rentals</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            Welcome to Co.Property! This platform helps you manage all aspects of your luxury rental properties, from
            basic information to detailed amenities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <SetupDatabase />
            <SeedButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Features</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Comprehensive property documentation</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Checklist tracking and progress visualization</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Secure storage of sensitive information</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Mobile and desktop optimized interface</span>
              </li>
            </ul>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <a href="/properties" className="text-blue-600 hover:underline">
                  View All Properties
                </a>
              </li>
              <li>
                <a href="/properties/add" className="text-blue-600 hover:underline">
                  Add New Property
                </a>
              </li>
              <li>
                <a href="/analytics" className="text-blue-600 hover:underline">
                  Analytics Dashboard
                </a>
              </li>
              <li>
                <a href="/settings" className="text-blue-600 hover:underline">
                  Account Settings
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
