import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function BookingCalendar({ bookings }: any) {

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");


  // Map bookings to calendar events
  const events = (bookings || []).map((b: any) => ({
  title: `${b.start} - ${b.end}`,   // calendar shows time slot

  start: new Date(`${b.date}T${b.start}`),
  end: new Date(`${b.date}T${b.end}`),

  tooltip: `Requester: ${b.name}
Contact: ${b.contact}
Participants: ${b.participants}
Description: ${b.description}
Status: ${b.status}`,

  name: b.name,
  status: b.status
}));

  return (
    <div style={{ height: 500 }}>

      <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"

  date={date}
  view={view}

  onNavigate={(newDate) => setDate(newDate)}
  onView={(newView: View) => setView(newView)}

  tooltipAccessor="tooltip"
  eventPropGetter={eventStyleGetter}

  messages={{ event: "Requester" }}

  components={{
    agenda: {
      event: ({ event }: any) => <span>{event.name}</span>
    }
  }}
/>

    </div>
  );
}

const eventStyleGetter = (event: any) => {

  let backgroundColor = "#facc15";

  if (event.status === "Approved") backgroundColor = "#16a34a";
  if (event.status === "Rejected") backgroundColor = "#dc2626";

  return {
    style: {
      backgroundColor,
      borderRadius: "6px",
      color: "white",
      border: "none"
    }
  };
};