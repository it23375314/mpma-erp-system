import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Tooltip } from "react-tooltip";
import { User, Phone, Users, FileText, CheckCircle } from "lucide-react";
import "react-tooltip/dist/react-tooltip.css";

const localizer = momentLocalizer(moment);

export default function BookingCalendar({ bookings }: any) {

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  // Map bookings to calendar events
  const events = (bookings || []).map((b: any) => ({
    title: `${b.start} - ${b.end}`,
    start: new Date(`${b.date}T${b.start}`),
    end: new Date(`${b.date}T${b.end}`),
    name: b.name,
    contact: b.contact,
    participants: b.participants,
    description: b.description,
    status: b.status
  }));

  return (
    <div style={{ height: 500 }} className="relative">

      <Calendar
        localizer={localizer}
        events={events}
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
            return (
              <div className="w-64">
                <h3 className="font-bold text-lg mb-2 border-b pb-2 text-blue-600">
                  Booking Details
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{e.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{e.contact}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{e.participants} participants</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 shrink-0 text-gray-500 mt-0.5" />
                    <span className="text-gray-600 leading-tight whitespace-normal">{e.description}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t mt-2">
                    <CheckCircle className={`w-4 h-4 ${e.status === 'Approved' ? 'text-green-500' : e.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'}`} />
                    <span className="font-semibold text-gray-700">{e.status}</span>
                  </div>
                </div>
              </div>
            );
          } catch {
            return null;
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