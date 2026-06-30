import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/fares", label: "Fares" },
  { href: "/admin/drivers", label: "Drivers" },
  { href: "/admin/rides", label: "Rides" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-140px)] flex">
      <aside className="w-56 bg-burgundy-900 text-white shrink-0">
        <div className="p-6">
          <h2 className="text-lg font-bold text-burgundy-200 mb-6">
            Admin Panel
          </h2>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-burgundy-200 hover:bg-burgundy-800 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div className="flex-1 bg-burgundy-50 p-8">{children}</div>
    </div>
  );
}
