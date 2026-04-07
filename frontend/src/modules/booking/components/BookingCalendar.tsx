import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Tooltip } from "react-tooltip";
import { Users, MapPin, Bus, School, Clock } from "lucide-react";
import "react-tooltip/dist/react-tooltip.css";
import { fetchApi } from "../../../utils/api";

const localizer = momentLocalizer(moment);

export default function BookingCalendar({ bookings, maintenances }: any) {

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const [c, v] = await Promise.all([
          fetchApi('/classrooms'),
          fetchApi('/vehicles')
        ]);
        setClassrooms(c);
        setVehicles(v);
      } catch (err) {
        console.error("Failed to load assets for calendar fallback", err);
      }
    };
    loadAssets();
  }, []);

  // Map bookings to calendar events — handle all 3 booking types:
  // Transport: departureDate / returnDate / departureTime
  // Classroom: dateFrom / dateTo / timeFrom / timeTo
  // Auditorium: date / start / end
  const events = (bookings || []).map((b: any) => {
    const isTransport = b.departureDate !== undefined;
    const isClassroom = b.dateFrom !== undefined;

    let dateStr: string, returnStr: string, startStr: string, endStr: string, title: string;

    if (isTransport) {
      dateStr   = b.departureDate  || "";
      returnStr = b.returnDate     || b.departureDate || "";
      startStr  = b.departureTime  || "00:00";
      endStr    = b.departureTime  || "23:59";
      title = `${b.vehicle?.name || "Vehicle"} ${b.vehicle?.number || ""} → ${b.destination || ""}`;
    } else if (isClassroom) {
      dateStr   = b.dateFrom || "";
      returnStr = b.dateTo   || b.dateFrom || "";
      startStr  = b.timeFrom || b.start    || "00:00";
      endStr    = b.timeTo   || b.end      || "23:59";
      title = `${b.classroom?.name || "Classroom"} (${b.courseName || "No Course"})`;
    } else {
      // Auditorium
      dateStr   = b.date  || "";
      returnStr = b.date  || "";
      startStr  = b.start || "00:00";
      endStr    = b.end   || "23:59";
      title = `${b.name || "Auditorium"} (${b.start} - ${b.end})`;
    }

    const startDate = dateStr   ? new Date(`${dateStr}T${startStr}`)   : new Date();
    const endDate   = returnStr ? new Date(`${returnStr}T${endStr}`)   : startDate;

    return {
      id: b.id,
      type: isTransport ? 'Transport' : isClassroom ? 'Classroom' : 'Auditorium',
      title,
      start: isNaN(startDate.getTime()) ? new Date() : startDate,
      end:   isNaN(endDate.getTime())   ? new Date() : endDate,
      name: b.requestingOfficerName || b.name || b.requesterName || "",
      contact: b.contactNumber || b.contact || b.requestingOfficerEmail || "",
      participants: b.numberOfParticipants || b.participants || "",
      description: b.additionalRequirements || b.purpose || b.description || "",
      status: b.status,
      // Extra fields for rich tooltips
      coordinator: b.courseCoordinator || "",
      courseName: b.courseName || "",
      classroomName: b.classroom?.name || "N/A",
      vehicleName: b.vehicle?.name || "N/A",
      vehicleType: b.vehicle?.type || "N/A",
      destination: b.destination || "",
      timeRange: `${startStr} - ${endStr}`
    };
  });

  const maintenanceEvents = (maintenances || []).map((m: any) => {
    // Determine the most descriptive facility name
    let facilityName = m.classroom?.name || 
                       (m.vehicle ? `${m.vehicle.name} ${m.vehicle.number || ''}` : null);
    
    // Fallback if association is missing but ID exists
    if (!facilityName && m.facilityId) {
      if (m.facilityType === 'Classroom') {
        const found = classrooms.find(c => c.id === m.facilityId);
        if (found) facilityName = found.name;
      } else if (m.facilityType === 'Transport') {
        const found = vehicles.find(v => (v.id === m.facilityId || v._id === m.facilityId));
        if (found) facilityName = `${found.name} ${found.number || ''}`;
      } else if (m.facilityType === 'Auditorium') {
        facilityName = 'Main Auditorium';
      }
    }

    // Final fallback
    if (!facilityName || facilityName === 'General') {
       facilityName = m.facilityType === 'General' ? 'Multiple Facilities / System' : m.facilityType;
    }

    return {
      id: m.id,
      type: 'Maintenance',
      facilityType: m.facilityType,
      facilityName: facilityName === 'General' ? 'Multiple Facilities / System' : facilityName,
      title: m.title, // Just the raw title
      start: new Date(`${m.dateFrom}T${m.timeFrom}`),
      end: new Date(`${m.dateTo}T${m.timeTo}`),
      dateFrom: m.dateFrom,
      dateTo: m.dateTo,
      timeFrom: m.timeFrom,
      timeTo: m.timeTo,
      name: "System Admin",
      description: m.description,
      status: "Maintenance"
    };
  });

  const allEvents = [...events, ...maintenanceEvents];

  return (
    <div style={{ height: 500 }} className="relative">

      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        date={date}
        view={view}
        onNavigate={(newDate) => setDate(newDate)}
        onView={(newView: View) => setView(newView)}
        tooltipAccessor={() => ""} // Disable native browser tooltip
        eventPropGetter={eventStyleGetter}
        components={{
          event: CustomEvent
        }}
        messages={{ event: "Time Slot" }}
      />

      <Tooltip 
        id="calendar-tooltip" 
        className="z-50"
        style={{ 
          backgroundColor: 'white', 
          color: '#1f2937', 
          padding: '16px', 
          opacity: 1, 
          border: '1px solid #e5e7eb', 
          zIndex: 9999, 
          borderRadius: '8px', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
        }}
        render={({ content }) => {
          if (!content) return null;
          try {
            const e = JSON.parse(content);
            const isMaintenance = e.status === 'Maintenance';
            
            return (
              <div className="w-80 overflow-hidden">
                {/* Header */}
                <div className={`p-4 -m-4 mb-4 flex items-center justify-between ${
                  isMaintenance ? 'bg-slate-800' : 
                  e.type === 'Classroom' ? 'bg-emerald-600' :
                  e.type === 'Transport' ? 'bg-orange-500' : 'bg-blue-600'
                } text-white`}>
                   <div className="flex items-center gap-2">
                     {isMaintenance ? <Clock className="w-4 h-4" /> : 
                      e.type === 'Classroom' ? <School className="w-4 h-4" /> :
                      e.type === 'Transport' ? <Bus className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                     <span className="font-bold tracking-tight">{e.type || 'Maintenance'} Details</span>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
                     {isMaintenance ? 'Under Maintenance' : e.status}
                   </span>
                </div>

                <div className="space-y-4 text-sm mt-4">
                  {/* Classroom Details */}
                  {e.type === 'Classroom' && (
                    <>
                      <div className="group">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Course Name</label>
                        <p className="font-bold text-slate-800 leading-tight">{e.courseName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Coordinator</label>
                          <p className="font-bold text-slate-700 text-xs">{e.coordinator}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Classroom</label>
                          <p className="font-bold text-brand-600 text-xs">{e.classroomName}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Transport Details */}
                  {e.type === 'Transport' && (
                    <>
                      <div className="group">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Destination</label>
                        <p className="font-bold text-slate-800 leading-tight flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" />
                          {e.destination}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Requester</label>
                          <p className="font-bold text-slate-700 text-xs">{e.name}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Vehicle</label>
                          <p className="font-bold text-orange-600 text-xs">{e.vehicleName} ({e.vehicleType})</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Auditorium / Generic Details */}
                  {(e.type === 'Auditorium' || isMaintenance) && (
                    <>
                      {!isMaintenance && (
                        <div className="group mb-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Requester Name</label>
                          <p className="font-bold text-slate-800 leading-tight">{e.name}</p>
                        </div>
                      )}

                      {isMaintenance && (
                         <div className="space-y-4">
                            <div className="border-b border-slate-100 pb-2">
                               <p className="text-[11px] font-bold text-brand-600 uppercase tracking-widest mb-1">{e.facilityType}</p>
                               <p className="text-lg font-black text-slate-800 leading-none">
                                 {e.facilityName}
                               </p>
                            </div>

                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              This {e.facilityType.toLowerCase()} is currently unavailable due to scheduled maintenance work.
                            </p>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                               <div className="flex items-center gap-2 mb-3">
                                  <span className="text-lg">📅</span>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maintenance Schedule</span>
                               </div>
                               
                               <div className="space-y-2">
                                  <div className="flex items-center justify-between text-[11px]">
                                     <span className="font-bold text-slate-500 uppercase">From</span>
                                     <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 shadow-sm">
                                        {e.dateFrom} | {e.timeFrom}
                                     </span>
                                  </div>
                                  <div className="flex items-center justify-between text-[11px]">
                                     <span className="font-bold text-slate-500 uppercase">To</span>
                                     <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 shadow-sm">
                                        {e.dateTo} | {e.timeTo}
                                     </span>
                                  </div>
                               </div>
                            </div>
                         </div>
                      )}

                      {!isMaintenance && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Description</label>
                          <p className="text-slate-600 text-xs leading-relaxed italic">"{e.description}"</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Common Footer Info */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                       <Clock className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-xs font-bold text-slate-600">{e.timeRange || 'All Day'}</span>
                     </div>
                     {e.participants && (
                       <div className="flex items-center gap-1.5">
                         <Users className="w-3.5 h-3.5 text-slate-400" />
                         <span className="text-xs font-bold text-slate-600">{e.participants} pax</span>
                       </div>
                     )}
                  </div>
                </div>
              </div>
            );
          } catch {
            return <div className="p-2 text-xs text-slate-400 italic">Error parsing details</div>;
          }
        }}
      />

    </div>
  );
}

// Custom Event Wrapper to attach the tooltip
const CustomEvent = ({ event }: any) => {
  return (
    <div 
      className="w-full h-full cursor-pointer p-1"
      data-tooltip-id="calendar-tooltip"
      data-tooltip-content={JSON.stringify(event)}
    >
      <div className="font-semibold text-xs leading-tight truncate">{event.title}</div>
    </div>
  );
};

const eventStyleGetter = (event: any) => {
  let backgroundColor = "#facc15";

  if (event.status === "Approved") backgroundColor = "#16a34a";
  if (event.status === "Rejected") backgroundColor = "#dc2626";
  if (event.status === "Maintenance") backgroundColor = "#475569"; // slate-600

  return {
    style: {
      backgroundColor,
      borderRadius: "6px",
      color: "white",
      border: "none",
      padding: 0
    }
  };
};