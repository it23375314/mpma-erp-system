import DashboardLayout from "../../../layouts/DashboardLayout";

export default function TransportBooking() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Transport Booking</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        Here users will be able to reserve the transport.
      </div>
    </DashboardLayout>
  );
}