import { getOpenRequests } from '@/lib/database-examples'

export default async function Home() {
  const { data: requests, error } = await getOpenRequests()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        RailMatch Vol. 2
      </h1>
      
      <p className="text-xl text-center text-gray-600 mb-12">
        Connecting shippers and carriers for rail cargo transport
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Open Requests</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            Error loading requests: {error.message}
          </div>
        )}
        
        {!requests || requests.length === 0 ? (
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-8 rounded text-center">
            No open requests at the moment. Check back later!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request: any) => (
              <div key={request.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">
                    {request.route_from} → {request.route_to}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {request.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Cargo:</strong> {request.cargo_description}</p>
                  <p><strong>Wagon Type:</strong> {request.wagon_type}</p>
                  <p><strong>Wagon Count:</strong> {request.wagon_count}</p>
                  <p><strong>Loading Date:</strong> {new Date(request.loading_date).toLocaleDateString()}</p>
                  {request.target_price && (
                    <p><strong>Target Price:</strong> ${request.target_price}</p>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Posted by {request.profiles?.company_name || request.profiles?.full_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">For Shippers</h3>
            <p className="text-gray-700 mb-4">
              Post your cargo transport requests and receive competitive bids from verified carriers.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
              Post a Request
            </button>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">For Carriers</h3>
            <p className="text-gray-700 mb-4">
              Browse available cargo requests and submit competitive bids to grow your business.
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
              View Requests
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <Hero />
      </div>
      <Footer />
    </main>
  );
}