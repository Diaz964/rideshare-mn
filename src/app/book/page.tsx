import BookingForm from "@/components/BookingForm";

export default function BookPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-burgundy-50 py-12 px-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-burgundy-dark mb-2">
          Book a Ride
        </h1>
        <p className="text-gray-600 mb-8">
          Enter your pickup and destination to get started.
        </p>
        <div className="bg-white rounded-2xl shadow-sm border border-burgundy-100 p-6">
          <BookingForm />
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-burgundy-100 p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Prefer to book by phone?
          </p>
          <a
            href="tel:6125582880"
            className="inline-flex items-center gap-2 text-xl font-bold text-burgundy hover:text-burgundy-dark transition-colors"
          >
            <span className="text-2xl">📞</span>
            (612) 558-2880
          </a>
          <p className="text-xs text-gray-400 mt-1">
            Available 24/7 for ride bookings
          </p>
        </div>
      </div>
    </div>
  );
}
