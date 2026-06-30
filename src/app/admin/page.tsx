import Link from "next/link";

const STATS = [
  { label: "Active Drivers", value: "12", href: "/admin/drivers" },
  { label: "Rides Today", value: "47", href: "/admin/rides" },
  { label: "Fare Types", value: "3", href: "/admin/fares" },
  { label: "Revenue Today", value: "$834.50", href: "/admin/rides" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-burgundy-dark mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-burgundy-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
            <div className="text-3xl font-bold text-burgundy">{stat.value}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-burgundy-100 p-6">
        <h2 className="text-lg font-semibold text-burgundy-dark mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/fares"
            className="px-4 py-2 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-burgundy-dark transition-colors"
          >
            Manage Fares
          </Link>
          <Link
            href="/admin/drivers"
            className="px-4 py-2 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-burgundy-dark transition-colors"
          >
            Manage Drivers
          </Link>
          <Link
            href="/admin/rides"
            className="px-4 py-2 bg-burgundy-light text-white text-sm font-medium rounded-lg hover:bg-burgundy transition-colors"
          >
            View All Rides
          </Link>
        </div>
      </div>
    </div>
  );
}
