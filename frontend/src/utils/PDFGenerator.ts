import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './api';

const PRIMARY_COLOR: [number, number, number] = [15, 23, 42]; // Slate-900
const SECONDARY_COLOR: [number, number, number] = [2, 132, 199]; // Blue-600
const SUCCESS_COLOR: [number, number, number] = [5, 150, 105]; // Emerald-600

interface StudentReceiptPayment {
  id: number;
  student_id: string;
  registration_fee: number;
  course_fee: number;
  full_amount_payable: number;
  amount_paid: number;
  payment_method: string;
  payment_status: string;
  payment_reference: string;
  transaction_id?: string | null;
  receipt_number?: string | null;
  paid_at?: string | null;
  created_at?: string | null;
}

interface StudentReceiptData {
  payment: StudentReceiptPayment;
  studentName: string;
  courseBatch?: string;
}

interface StudentProfilePdfData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  course: string;
  batch: string;
  studentCategory?: string | null;
  nic?: string | null;
  passport?: string | null;
  enrollmentDate?: string;
  status: string;
  latestPayment?: StudentReceiptPayment | null;
  registrationStatus?: string;
}

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

export const generateStudentPaymentReceipt = ({
  payment,
  studentName,
  courseBatch,
}: StudentReceiptData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const receiptNo = payment.receipt_number || `PAY-${payment.id}`;
  const paidAt = payment.paid_at
    ? new Date(payment.paid_at).toLocaleString('en-LK')
    : 'N/A';

  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('MPMA ERP SYSTEM', 20, 24);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Student Payment Receipt', 20, 32);

  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Receipt', 20, 60);

  doc.setDrawColor(SUCCESS_COLOR[0], SUCCESS_COLOR[1], SUCCESS_COLOR[2]);
  doc.setLineWidth(1);
  doc.line(20, 65, 78, 65);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleString('en-LK')}`, pageWidth - 20, 58, { align: 'right' });
  doc.text(`Receipt No: ${receiptNo}`, pageWidth - 20, 66, { align: 'right' });

  doc.setFillColor(236, 253, 245);
  doc.roundedRect(20, 76, pageWidth - 40, 30, 3, 3, 'F');
  doc.setTextColor(SUCCESS_COLOR[0], SUCCESS_COLOR[1], SUCCESS_COLOR[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.payment_status.toUpperCase(), 30, 88);
  doc.setFontSize(20);
  doc.text(`Rs. ${Number(payment.amount_paid).toLocaleString()}`, 30, 100);

  const details = [
    ['Student Name', studentName],
    ['Student ID', payment.student_id],
    ['Course / Batch', courseBatch || 'N/A'],
    ['Payment Reference', payment.payment_reference],
    ['Transaction ID', payment.transaction_id || 'N/A'],
    ['Payment Method', payment.payment_method || 'N/A'],
    ['Paid At', paidAt],
  ];

  autoTable(doc, {
    startY: 118,
    body: details,
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 116, 139], cellWidth: 55 },
      1: { textColor: [15, 23, 42] },
    },
  });

  const feesStartY = (doc as any).lastAutoTable.finalY + 10;
  autoTable(doc, {
    startY: feesStartY,
    head: [['Fee Type', 'Amount']],
    body: [
      ['Registration Fee', `Rs. ${Number(payment.registration_fee).toLocaleString()}`],
      ['Course Fee', `Rs. ${Number(payment.course_fee).toLocaleString()}`],
      ['Total Payable', `Rs. ${Number(payment.full_amount_payable).toLocaleString()}`],
      ['Amount Paid', `Rs. ${Number(payment.amount_paid).toLocaleString()}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: SUCCESS_COLOR, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 10, cellPadding: 4, font: 'helvetica' },
    columnStyles: {
      1: { halign: 'right', fontStyle: 'bold' },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 18;
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a system-generated receipt. No signature required.', pageWidth / 2, finalY, { align: 'center' });

  doc.save(`payment_receipt_${receiptNo}.pdf`);
};

export const generateStudentProfilePdf = (student: StudentProfilePdfData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const fullName = `${student.firstName} ${student.lastName}`.trim();
  const payment = student.latestPayment;

  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('MPMA ERP SYSTEM', 20, 24);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Student Management Module', 20, 32);

  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Profile', 20, 60);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleString('en-LK')}`, pageWidth - 20, 60, { align: 'right' });
  doc.text(`Student ID: ${student.id}`, pageWidth - 20, 67, { align: 'right' });

  autoTable(doc, {
    startY: 80,
    body: [
      ['Full Name', fullName],
      ['Student Category', student.studentCategory || 'N/A'],
      ['NIC / Passport', student.nic || student.passport || 'N/A'],
      ['Email', student.email],
      ['Phone', student.phone || 'N/A'],
      ['Date of Birth', student.dob ? new Date(student.dob).toLocaleDateString('en-LK') : 'N/A'],
      ['Gender', student.gender || 'N/A'],
      ['Address', student.address || 'N/A'],
      ['Course', student.course],
      ['Batch', student.batch],
      ['Registered Date', student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString('en-LK') : 'N/A'],
      ['Registration Status', student.registrationStatus || student.status],
    ],
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 116, 139], cellWidth: 50 },
      1: { textColor: [15, 23, 42] },
    },
  });

  const paymentStartY = (doc as any).lastAutoTable.finalY + 12;
  autoTable(doc, {
    startY: paymentStartY,
    head: [['Payment Field', 'Value']],
    body: payment
      ? [
          ['Payment Reference', payment.payment_reference],
          ['Payment Status', payment.payment_status],
          ['Payment Method', payment.payment_method],
          ['Registration Fee', `Rs. ${Number(payment.registration_fee).toLocaleString()}`],
          ['Course Fee', `Rs. ${Number(payment.course_fee).toLocaleString()}`],
          ['Total Payable', `Rs. ${Number(payment.full_amount_payable).toLocaleString()}`],
          ['Amount Paid', `Rs. ${Number(payment.amount_paid).toLocaleString()}`],
          ['Receipt Number', payment.receipt_number || 'N/A'],
        ]
      : [['Payment', 'No payment record found']],
    theme: 'striped',
    headStyles: { fillColor: PRIMARY_COLOR, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 4, font: 'helvetica' },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 16;
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a system-generated student profile.', pageWidth / 2, finalY, { align: 'center' });

  doc.save(`student_profile_${student.id.slice(0, 8).toUpperCase()}.pdf`);
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
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 3, font: 'helvetica' }
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
};
