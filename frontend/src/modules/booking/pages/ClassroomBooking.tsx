import DashboardLayout from "../../../layouts/DashboardLayout";

export default function ClassroomBooking() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Classroom Booking</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        Here users will be able to reserve the classroom.
      </div>
    </DashboardLayout>
  );
}