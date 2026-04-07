import { Request, Response } from 'express';
import { AuditoriumBooking } from '../models/AuditoriumBooking';

export const getAuditoriumBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await AuditoriumBooking.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAuditoriumBooking = async (req: Request, res: Response) => {
  try {
    const booking = await AuditoriumBooking.create(req.body);
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAuditoriumBooking = async (req: Request, res: Response) => {
  try {
    const booking = await AuditoriumBooking.findByPk(req.params.id as string);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Update all editable fields if provided, preserving existing values otherwise
    const { name, contact, date, start, end, participants, description, status } = req.body;

    if (name !== undefined) booking.name = name;
    if (contact !== undefined) booking.contact = contact;
    if (date !== undefined) booking.date = date;
    if (start !== undefined) booking.start = start;
    if (end !== undefined) booking.end = end;
    if (participants !== undefined) booking.participants = participants;
    if (description !== undefined) booking.description = description;
    if (status !== undefined) booking.status = status;

    await booking.save();
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAuditoriumBooking = async (req: Request, res: Response) => {
  try {
    const booking = await AuditoriumBooking.findByPk(req.params.id as string);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    await booking.destroy();
    res.status(200).json({ message: 'Booking deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAuditoriumBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const booking = await AuditoriumBooking.findByPk(req.params.id as string);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
