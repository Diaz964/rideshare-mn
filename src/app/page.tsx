import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-burgundy to-burgundy-dark text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Your Ride, Your Way
          </h1>
          <p className="text-xl text-burgundy-200 mb-10 max-w-2xl mx-auto">
            Affordable and reliable rides across Minnesota. Book in seconds, pay
            with card, and get where you need to go.
          </p>
          <Link
            href="/book"
            className="inline-block bg-white text-burgundy font-semibold text-lg px-8 py-4 rounded-full hover:bg-burgundy-50 transition-colors shadow-lg"
          >
            Book a Ride Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-burgundy-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-burgundy-dark mb-14">
            Why XELAJU?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon="🚗"
              title="Fast Pickup"
              description="Get matched with a nearby driver in minutes. No long waits."
            />
            <FeatureCard
              icon="💳"
              title="Card Payment"
              description="Pay securely with your credit or debit card. No cash needed."
            />
            <FeatureCard
              icon="🛡️"
              title="Safe & Reliable"
              description="Verified drivers and real-time ride tracking for your peace of mind."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-burgundy mb-6">
            Ready to Go?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Enter your pickup and destination, choose your ride, and pay — all
            in one place.
          </p>
          <Link
            href="/book"
            className="inline-block bg-burgundy text-white font-semibold text-lg px-8 py-4 rounded-full hover:bg-burgundy-dark transition-colors shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-burgundy-100 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-burgundy mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
