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
      </div>
    </div>
  );
}
