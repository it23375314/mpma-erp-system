import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './api';

const PRIMARY_COLOR = [15, 23, 42]; // Slate-900
const SECONDARY_COLOR = [2, 132, 199]; // Blue-600

export const generateBookingSlip = (type: 'Transport' | 'Classroom' | 'Auditorium', data: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Branding Header
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('MPMA ERP SYSTEM', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Advanced Resource Management Platform', 20, 32);

  // Slip Title
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const title = `${type} Reservation Slip`;
  doc.text(title, 20, 60);

  // Horizontal Line
  doc.setDrawColor(SECONDARY_COLOR[0], SECONDARY_COLOR[1], SECONDARY_COLOR[2]);
  doc.setLineWidth(1);
  doc.line(20, 65, 80, 65);

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - 20, 60, { align: 'right' });
  doc.text(`Reference ID: #${type.toUpperCase().substring(0,3)}-${Math.floor(1000 + Math.random() * 9000)}`, pageWidth - 20, 67, { align: 'right' });

  // Booking Information
  const infoRows = [];
  if (type === 'Transport') {
    infoRows.push(['Requester Name', data.requesterName || data.name]);
    infoRows.push(['Division', data.department || 'N/A']);
    infoRows.push(['Contact Number', data.contactNumber || data.contact]);
    infoRows.push(['Vehicle', data.vehicle?.name || data.vehicleName || 'N/A']);
    infoRows.push(['Route', `${data.pickupLocation || data.pickup} to ${data.destination}`]);
    infoRows.push(['Departure', `${formatDate(data.departureDate)} at ${data.departureTime}`]);
    infoRows.push(['Return', formatDate(data.returnDate)]);
    infoRows.push(['Estimated KM', `${data.estimatedKm || 'N/A'} KM`]);
    infoRows.push(['Purpose', data.purpose || data.description || 'Trip']);
  } else if (type === 'Classroom') {
    infoRows.push(['Requester', data.requestingOfficerName || data.name]);
    infoRows.push(['Designation', data.designation || 'N/A']);
    infoRows.push(['Course', data.courseName]);
    infoRows.push(['Classroom', data.classroom?.name || 'N/A']);
    infoRows.push(['Date Range', `${formatDate(data.dateFrom)} to ${formatDate(data.dateTo)}`]);
    infoRows.push(['Time Slot', `${data.timeFrom || data.start} - ${data.timeTo || data.end}`]);
    infoRows.push(['Participants', `${data.numberOfParticipants || data.participants} PAX`]);
  } else if (type === 'Auditorium') {
    infoRows.push(['Requester', data.name]);
    infoRows.push(['Contact', data.contact]);
    infoRows.push(['Date', formatDate(data.date)]);
    infoRows.push(['Schedule', `${data.start} - ${data.end}`]);
    infoRows.push(['Participants', `${data.participants} PAX`]);
    infoRows.push(['Event', data.description || 'N/A']);
  }

  autoTable(doc, {
    startY: 80,
    body: infoRows,
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 116, 139], cellWidth: 50 },
      1: { textColor: [15, 23, 42] }
    }
  });

  // Footer / Status
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.rect(20, finalY, pageWidth - 40, 40, 'F');
  
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Status:', 30, finalY + 15);
  
  const status = data.status || 'Pending';
  const statusColor: [number, number, number] = status === 'Approved' ? [5, 150, 105] : [217, 119, 6];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(status.toUpperCase(), 50, finalY + 15);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('This is an automatically generated document from the MPMA ERP System.', pageWidth / 2, finalY + 30, { align: 'center' });

  doc.save(`${type}_Slip_${data.id || 'new'}.pdf`);
};

export const generateListReport = (title: string, columns: string[], rows: any[][]) => {
  const doc = new jsPDF('l', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('MPMA ERP SYSTEM', 20, 20);
  
  doc.setFontSize(14);
  doc.text(title, pageWidth - 20, 20, { align: 'right' });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 40);

  autoTable(doc, {
    startY: 45,
    head: [columns],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toLocaleDateString()}.pdf`);
};
