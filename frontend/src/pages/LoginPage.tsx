import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      
      <div className="w-[420px] bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
          Mahapola Marian Academy
        </h1>

        {/* Role Toggle */}
        <div className="flex mb-6 bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded-full ${
              role === "admin" ? "bg-blue-600 text-white" : "text-gray-700"
            }`}
          >
            Admin
          </button>

          <button
            onClick={() => setRole("user")}
            className={`flex-1 py-2 rounded-full ${
              role === "user" ? "bg-blue-600 text-white" : "text-gray-700"
            }`}
          >
            User
          </button>
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          className="w-full p-3 border rounded-lg mb-4"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-6"
        />

        {/* Login Button */}
        <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
         Login
        </button>

      </div>

    </div>
  );
}