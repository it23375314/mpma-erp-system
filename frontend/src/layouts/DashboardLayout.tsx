import { Link } from "react-router-dom";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex">

      {/* Sidebar */}
      <div className="w-64 h-screen bg-gray-900 text-white p-6 fixed left-0 top-0">

        <h2 className="text-2xl font-bold mb-8">
          MPMA ERP
        </h2>

        <nav className="space-y-3">

          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Dashboard
          </Link>

          <Link
            to="/auditorium-booking"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Auditorium Booking
          </Link>

          <Link
            to="/classroom-booking"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Classroom Booking
          </Link>

          <Link
            to="/transport-booking"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            Transport Booking
          </Link>

        </nav>

      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-10 bg-gray-100 min-h-screen overflow-y-auto">
        {children}
      </div>

    </div>
  );
}