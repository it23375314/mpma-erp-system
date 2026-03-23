import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { 
  Users, 
  CalendarCheck, 
  MonitorPlay,
  Bus,
  TrendingUp,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const [greeting, setGreeting] = useState("");
  const [dateStr, setDateStr] = useState("");
  const userRole = localStorage.getItem("userRole") || "user";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    };
    setDateStr(new Date().toLocaleDateString(undefined, options));
  }, []);

  const stats = [
    { title: "Total Bookings", value: "128", icon: CalendarCheck, trend: "+12%", trendUp: true, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Pending Approvals", value: "14", icon: Clock, trend: "-2%", trendUp: false, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Active Users", value: "842", icon: Users, trend: "+5%", trendUp: true, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Resource Utilization", value: "68%", icon: TrendingUp, trend: "+8%", trendUp: true, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  const quickLinks = [
    { title: "Auditorium", desc: "Manage large events", icon: MonitorPlay, link: "/auditorium-booking", color: "from-blue-500 to-indigo-600" },
    { title: "Classrooms", desc: "Schedule lectures", icon: Users, link: "/classroom-booking", color: "from-emerald-500 to-teal-600" },
    { title: "Transport", desc: "Book vehicles", icon: Bus, link: "/transport-booking", color: "from-orange-500 to-amber-600" },
  ];

  return (
    <DashboardLayout>
      
      {/* Hero Welcome Section */}
      <div className="mb-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-100/50 to-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {greeting}, <span className="capitalize text-brand-600">{userRole}</span> 👋
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            {dateStr} • Here's what's happening with your resources today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-md ${
                  stat.trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                }`}>
                  {stat.trend}
                </div>
              </div>
              <div>
                <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Access/Modules Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 px-1">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <a 
                key={idx} 
                href={link.link}
                className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${link.color}`}></div>
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${link.color} text-white shadow-inner`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{link.title}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">{link.desc}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity / Information Block Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">System Overview</h2>
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
            <p className="text-slate-400 font-medium text-sm flex max-w-sm text-center">
              The dashboard offers an at-a-glance view of resource metrics. Once connected to a backend, real-time analytics charts will appear here.
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Schedule</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex flex-col items-center justify-center text-brand-700 font-bold border border-brand-100">
                <span className="text-xs uppercase">Oct</span>
                <span className="leading-none">24</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">Maritime Seminar</h4>
                <p className="text-xs text-slate-500 mt-1">Main Auditorium • 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}