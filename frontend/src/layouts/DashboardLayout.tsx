import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LogOut, 
  LayoutDashboard, 
  MonitorPlay, 
  BookOpen, 
  Bus,
  Bell,
  Search,
  UserCircle,
  Car,
  School,
  Wrench,
  ChevronDown,
  ChevronRight,
  ClipboardList
} from "lucide-react";
import logoImg from "../assets/logo.png";

export default function DashboardLayout({ children }: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole") || "user";
  const [isBookingOpen, setIsBookingOpen] = useState(
    location.pathname.includes("-booking") || location.pathname.includes("/manage-")
  );

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const bookingSubItems = [
    { path: "/auditorium-booking", label: "Auditorium Booking", icon: MonitorPlay },
    { path: "/classroom-booking", label: "Classroom Booking", icon: BookOpen },
    { path: "/transport-booking", label: "Transport Booking", icon: Bus },
  ];

  if (userRole === "admin") {
    bookingSubItems.push({ path: "/manage-vehicles", label: "Manage Vehicles", icon: Car });
    bookingSubItems.push({ path: "/manage-classrooms", label: "Manage Classrooms", icon: School });
    bookingSubItems.push({ path: "/manage-maintenance", label: "Manage Maintenance", icon: Wrench });
  }

  const adminItems: any[] = []; // Now empty as they are moved

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 relative z-20 shadow-2xl">
        
        {/* Logo/Brand Area */}
        <div className="h-24 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center">
              <img src={logoImg} alt="SLPA Logo" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">MPMA</h2>
              <p className="text-xs text-slate-400 font-medium tracking-wide border-t border-slate-800 pt-0.5 mt-0.5">ERP SYSTEM</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Main Menu
          </p>
          
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              location.pathname === "/dashboard" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/20" 
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${location.pathname === "/dashboard" ? "text-white" : "text-slate-400 group-hover:text-brand-400"}`} />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          {/* Booking Management Parent */}
          <div className="space-y-1">
            <button
              onClick={() => setIsBookingOpen(!isBookingOpen)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isBookingOpen && !location.pathname.includes("/dashboard") && !adminItems.some(i => location.pathname.startsWith(i.path))
                  ? "bg-slate-800/50 text-white"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className={`w-5 h-5 ${isBookingOpen ? "text-brand-400" : "text-slate-400 group-hover:text-brand-400"}`} />
                <span className="font-medium text-sm">Booking Management</span>
              </div>
              {isBookingOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
            </button>

          {/* Submenu Items */}
          {isBookingOpen && (
            <div className="ml-4 pl-4 border-l border-slate-800 space-y-1 mt-1 transition-all">
              {bookingSubItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? "bg-brand-600/10 text-brand-400 font-semibold" 
                        : "hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-400" : "text-slate-500 group-hover:text-brand-400"}`} />
                    <span className="text-xs">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-3 mb-4 px-2">
            <UserCircle className="w-10 h-10 text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-white capitalize">{userRole} User</p>
              <p className="text-xs text-slate-500">Logged in via Email</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 py-2.5 px-4 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search across the ERP..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-brand-600 transition-colors rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 leading-tight capitalize">{userRole}</p>
                <p className="text-xs text-slate-500">Active status</p>
              </div>
              <div className="w-9 h-9 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                {userRole.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}