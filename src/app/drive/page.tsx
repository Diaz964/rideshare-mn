import DriverApplicationForm from "@/components/DriverApplicationForm";

export default function DrivePage() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-burgundy-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-burgundy-dark mb-2">
          Drive with XELAJU
        </h1>
        <p className="text-gray-600 mb-8">
          Join our team and start earning. Fill out the form below and we will
          review your application.
        </p>
        <div className="bg-white rounded-2xl shadow-sm border border-burgundy-100 p-6">
          <DriverApplicationForm />
        </div>
      </div>
    </div>
  );
}
