import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

// Booking Management Imports
import AuditoriumBooking from "./modules/booking/pages/AuditoriumBooking";
import ClassroomBooking from "./modules/booking/pages/ClassroomBooking";
import TransportBooking from "./modules/booking/pages/TransportBooking";
import NewBooking from "./modules/booking/pages/NewBooking";
import EditBooking from "./modules/booking/pages/EditBooking";
import ManageVehicles from "./modules/booking/pages/ManageVehicles";
import NewTransportBooking from "./modules/booking/pages/NewTransportBooking";
import EditTransportBooking from "./modules/booking/pages/EditTransportBooking";
import ManageClassrooms from "./modules/booking/pages/ManageClassrooms";
import NewClassroomBooking from "./modules/booking/pages/NewClassroomBooking";
import EditClassroomBooking from "./modules/booking/pages/EditClassroomBooking";
import ManageMaintenance from "./modules/booking/pages/ManageMaintenance";
import ManageUsers from "./modules/booking/pages/ManageUsers";

// Student Management Imports
import ManageEnrollment from "./modules/students/pages/ManageEnrollment";
import StudentEnrollment from "./modules/students/pages/StudentEnrollment";
import StudentPayment from "./modules/students/pages/StudentPayment";
import GovPayDemo from "./pages/student/GovPayDemo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Booking Management Routes */}
      <Route path="/auditorium-booking" element={<AuditoriumBooking />} />
      <Route path="/new-booking" element={<NewBooking />} />
      <Route path="/classroom-booking" element={<ClassroomBooking />} />
      <Route path="/transport-booking" element={<TransportBooking />} />
      <Route path="/edit-booking/:id" element={<EditBooking />} />
      <Route path="/manage-vehicles" element={<ManageVehicles />} />
      <Route path="/manage-classrooms" element={<ManageClassrooms />} />
      <Route path="/new-transport-booking" element={<NewTransportBooking />} />
      <Route path="/edit-transport-booking/:id" element={<EditTransportBooking />} />
      <Route path="/new-classroom-booking" element={<NewClassroomBooking />} />
      <Route path="/edit-classroom-booking/:id" element={<EditClassroomBooking />} />
      <Route path="/manage-maintenance" element={<ManageMaintenance />} />
      <Route path="/manage-users" element={<ManageUsers />} />

      {/* Student Management Routes */}
      <Route path="/student-management/enrollment" element={<ManageEnrollment />} />
      <Route path="/student-management/enrollment/new" element={<StudentEnrollment />} />
      <Route path="/student-management/payment" element={<StudentPayment />} />
      <Route path="/student-management/payment/govpay-demo" element={<GovPayDemo />} />
    </Routes>
  );
}

export default App;