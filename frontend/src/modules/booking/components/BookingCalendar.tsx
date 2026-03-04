import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function BookingCalendar({ bookings }: any) {

  const events = (bookings || []).map((b: any) => ({
  title: `${b.start} - ${b.end}`,
  start: new Date(`${b.date}T${b.start}`),
  end: new Date(`${b.date}T${b.end}`),

  status: b.status,

  tooltip: `
Requester: ${b.name}
Contact: ${b.contact}
Participants: ${b.participants}
Description: ${b.description}
Status: ${b.status}
`
}));

  return (
    <div style={{ height: 500 }}>
      <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  tooltipAccessor="tooltip"
  eventPropGetter={eventStyleGetter}
/>
    </div>
  );
}

const eventStyleGetter = (event: any) => {

  let backgroundColor = "#facc15"; // Pending (yellow)

  if (event.status === "Approved") {
    backgroundColor = "#16a34a"; // green
  }

  if (event.status === "Rejected") {
    backgroundColor = "#dc2626"; // red
  }

  return {
    style: {
      backgroundColor,
      borderRadius: "5px",
      color: "white",
      border: "none",
      display: "block"
    }
  }
}