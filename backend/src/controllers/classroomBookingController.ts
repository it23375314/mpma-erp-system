import { Request, Response } from 'express';
import { ClassroomBooking } from '../models/ClassroomBooking';
import { Classroom } from '../models/Classroom';

export const getClassroomBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await ClassroomBooking.findAll({ 
      include: [{ model: Classroom, as: 'classroom' }],
      order: [['createdAt', 'DESC']] 
    });
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createClassroomBooking = async (req: Request, res: Response) => {
  try {
    const booking = await ClassroomBooking.create(req.body);
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateClassroomBooking = async (req: Request, res: Response) => {
  try {
    const booking = await ClassroomBooking.findByPk(req.params.id as string, {
      include: [{ model: Classroom, as: 'classroom' }]
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const {
      requestingOfficerName, designation, requestingOfficerEmail,
      courseName, audienceType, batchCode, numberOfParticipants,
      dateFrom, dateTo, courseCoordinator, timeFrom, timeTo,
      preferredDaysOfWeek, paidCourse, classroomId, exam,
      additionalRequirements, status
    } = req.body;

    if (requestingOfficerName !== undefined) booking.requestingOfficerName = requestingOfficerName;
    if (designation !== undefined) booking.designation = designation;
    if (requestingOfficerEmail !== undefined) booking.requestingOfficerEmail = requestingOfficerEmail;
    if (courseName !== undefined) booking.courseName = courseName;
    if (audienceType !== undefined) booking.audienceType = audienceType;
    if (batchCode !== undefined) booking.batchCode = batchCode;
    if (numberOfParticipants !== undefined) booking.numberOfParticipants = numberOfParticipants;
    if (dateFrom !== undefined) booking.dateFrom = dateFrom;
    if (dateTo !== undefined) booking.dateTo = dateTo;
    if (courseCoordinator !== undefined) booking.courseCoordinator = courseCoordinator;
    if (timeFrom !== undefined) booking.timeFrom = timeFrom;
    if (timeTo !== undefined) booking.timeTo = timeTo;
    if (preferredDaysOfWeek !== undefined) booking.preferredDaysOfWeek = preferredDaysOfWeek;
    if (paidCourse !== undefined) booking.paidCourse = paidCourse;
    if (classroomId !== undefined) booking.classroomId = classroomId;
    if (exam !== undefined) booking.exam = exam;
    if (additionalRequirements !== undefined) booking.additionalRequirements = additionalRequirements;
    if (status !== undefined) booking.status = status;

    await booking.save();
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteClassroomBooking = async (req: Request, res: Response) => {
  try {
    const booking = await ClassroomBooking.findByPk(req.params.id as string);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    await booking.destroy();
    res.status(200).json({ message: 'Booking deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClassroomBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const booking = await ClassroomBooking.findByPk(req.params.id as string);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
