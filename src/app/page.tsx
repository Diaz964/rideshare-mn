import Link from "next/link";
import { Car, Shield, DollarSign, MapPin, Clock, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Ride, Your Way
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Minnesota&apos;s premier ride-sharing service. Safe, affordable, and
              always just a tap away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-purple-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ride with Us
              </Link>
              <Link
                href="/register/driver"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Drive with Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose RideShare MN?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-purple-600" />}
              title="Safe & Secure"
              description="All drivers are background-checked and verified. Real-time ride tracking for peace of mind."
            />
            <FeatureCard
              icon={<DollarSign className="h-8 w-8 text-purple-600" />}
              title="Affordable Fares"
              description="Competitive pricing with no hidden fees. Know your fare before you ride."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-purple-600" />}
              title="Quick Pickups"
              description="Average pickup time under 5 minutes in the Twin Cities metro area."
            />
            <FeatureCard
              icon={<MapPin className="h-8 w-8 text-purple-600" />}
              title="Minnesota Coverage"
              description="Serving Minneapolis, St. Paul, and surrounding metro areas throughout Minnesota."
            />
            <FeatureCard
              icon={<Star className="h-8 w-8 text-purple-600" />}
              title="Rated Drivers"
              description="Community-driven ratings ensure you always get a quality ride experience."
            />
            <FeatureCard
              icon={<Car className="h-8 w-8 text-purple-600" />}
              title="Drive & Earn"
              description="Flexible schedule, great earnings. Be your own boss and drive when you want."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Whether you need a ride or want to earn money driving, RideShare MN
            has you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Sign Up as Passenger
            </Link>
            <Link
              href="/register/driver"
              className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Apply to Drive
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Car className="h-6 w-6 text-purple-400" />
              <span className="text-white font-bold text-lg">RideShare MN</span>
            </div>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} RideShare MN. Serving Minnesota
              with pride.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
