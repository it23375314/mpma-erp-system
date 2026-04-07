import { Request, Response } from 'express';
import { AuditoriumBooking } from '../models/AuditoriumBooking';
import { ClassroomBooking } from '../models/ClassroomBooking';
import { TransportBooking } from '../models/TransportBooking';
import Maintenance from '../models/Maintenance';
import { Classroom } from '../models/Classroom';
import { Vehicle } from '../models/Vehicle';
import { Op } from 'sequelize';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get Totals
    const auditoriumTotal = await AuditoriumBooking.count();
    const classroomTotal = await ClassroomBooking.count();
    const transportTotal = await TransportBooking.count();

    // Get Today's Activities
    const todayAuditorium = await AuditoriumBooking.findAll({
      where: { date: today }
    });

    const todayClassroom = await ClassroomBooking.findAll({
      where: {
        dateFrom: { [Op.lte]: today },
        dateTo: { [Op.gte]: today }
      }
    });

    const todayTransport = await TransportBooking.findAll({
      where: {
        departureDate: { [Op.lte]: today },
        returnDate: { [Op.gte]: today }
      }
    });

    const todayMaintenance = await Maintenance.findAll({
      where: {
        dateFrom: { [Op.lte]: today },
        dateTo: { [Op.gte]: today }
      },
      include: [
        { model: Classroom, as: 'classroom' },
        { model: Vehicle, as: 'vehicle' }
      ]
    });

    // Format activities
    const activities: any[] = [
      ...todayAuditorium.map(b => ({ type: 'Auditorium', title: b.description, time: `${b.start} - ${b.end}`, status: b.status })),
      ...todayClassroom.map(b => ({ type: 'Classroom', title: b.courseName, time: `${b.timeFrom} - ${b.timeTo}`, status: b.status })),
      ...todayTransport.map(b => ({ type: 'Transport', title: b.destination, time: b.departureTime, status: b.status })),
      ...todayMaintenance.map((m: any) => {
        const facilityName = m.classroom?.name || m.vehicle?.name || m.facilityType;
        return { 
          type: 'Maintenance', 
          title: `${m.title} (${facilityName})`, 
          time: `${m.timeFrom} - ${m.timeTo}`, 
          status: 'Maintenance' 
        };
      })
    ];

    res.json({
      totals: {
        auditorium: auditoriumTotal,
        classroom: classroomTotal,
        transport: transportTotal,
        overall: auditoriumTotal + classroomTotal + transportTotal
      },
      todayActivities: activities
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
