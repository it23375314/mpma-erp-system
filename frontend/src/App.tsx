import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

import AuditoriumBooking from "./modules/booking/pages/AuditoriumBooking";
import ClassroomBooking from "./modules/booking/pages/ClassroomBooking";
import TransportBooking from "./modules/booking/pages/TransportBooking";
import NewBooking from "./modules/booking/pages/NewBooking";
import EditBooking from "./modules/booking/pages/EditBooking";



function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auditorium-booking" element={<AuditoriumBooking />} />
      <Route path="/new-booking" element={<NewBooking />} />
      <Route path="/classroom-booking" element={<ClassroomBooking />} />
      <Route path="/transport-booking" element={<TransportBooking />} />
      <Route path="/edit-booking/:id" element={<EditBooking />} />
    </Routes>
  );
}

export default App;