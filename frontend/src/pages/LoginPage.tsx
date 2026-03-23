import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ship, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Left side: Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900 text-white flex-col justify-between p-12">
        
        {/* Abstract Background Gradient Graphic */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay bg-gradient-to-br from-brand-600 via-brand-800 to-indigo-900" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-500 blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-blue-400 blur-3xl opacity-20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <Ship className="w-8 h-8 text-brand-200" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              MPMA ERP
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-20 space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight text-white drop-shadow-sm">
            Mahapola Port &<br/> Maritime Academy
          </h1>
          <p className="text-xl text-brand-100 font-light leading-relaxed">
            Enterprise Resource Planning framework designed to simplify bookings, optimize operations, and connect our maritime community.
          </p>
        </div>

        <div className="relative z-10 text-sm text-brand-300 font-medium">
          &copy; {new Date().getFullYear()} MPMA. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-32 bg-white relative">
        <div className="mx-auto w-full max-w-md">
          
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
               <div className="p-4 bg-brand-50 rounded-2xl text-brand-600 shadow-sm border border-brand-100">
                <Ship className="w-10 h-10" />
               </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please sign in to your account
            </p>
          </div>

          <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl sm:border border-gray-100 sm:p-10 p-4">
            
            {/* Role Toggle Selector */}
            <div className="flex mb-8 bg-gray-100/80 p-1.5 rounded-xl">
              <button
                onClick={() => setRole("admin")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  role === "admin"
                    ? "bg-white text-brand-700 shadow shadow-gray-200/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Administrator
              </button>
              <button
                onClick={() => setRole("user")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  role === "user"
                    ? "bg-white text-brand-700 shadow shadow-gray-200/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Regular User
              </button>
            </div>

            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-colors duration-200 outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-colors duration-200 outline-none"
                  />
                </div>
                <div className="mt-2 flex items-center justify-end">
                  <a href="#" className="text-xs font-medium text-brand-600 hover:text-brand-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => {
                  localStorage.setItem("userRole", role);
                  navigate("/dashboard");
                }}
                className="w-full flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-500/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                Sign In
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}