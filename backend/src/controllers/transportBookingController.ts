import { Request, Response } from 'express';
import { TransportBooking } from '../models/TransportBooking';
import { Vehicle } from '../models/Vehicle';

export const getTransportBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await TransportBooking.findAll({ 
      include: [{ model: Vehicle, as: 'vehicle' }],
      order: [['createdAt', 'DESC']] 
    });
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransportBooking = async (req: Request, res: Response) => {
  try {
    const booking = await TransportBooking.create(req.body);
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTransportBooking = async (req: Request, res: Response) => {
  try {
    const booking = await TransportBooking.findByPk(req.params.id as string, {
      include: [{ model: Vehicle, as: 'vehicle' }]
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const {
      requesterName, designation, department, contactNumber,
      departureDate, returnDate, departureTime,
      pickupLocation, destination, purpose, vehicleId, status
    } = req.body;

    if (requesterName !== undefined) booking.requesterName = requesterName;
    if (designation !== undefined) booking.designation = designation;
    if (department !== undefined) booking.department = department;
    if (contactNumber !== undefined) booking.contactNumber = contactNumber;
    if (departureDate !== undefined) booking.departureDate = departureDate;
    if (returnDate !== undefined) booking.returnDate = returnDate;
    if (departureTime !== undefined) booking.departureTime = departureTime;
    if (pickupLocation !== undefined) booking.pickupLocation = pickupLocation;
    if (destination !== undefined) booking.destination = destination;
    if (purpose !== undefined) booking.purpose = purpose;
    if (vehicleId !== undefined) booking.vehicleId = vehicleId;
    if (status !== undefined) booking.status = status;

    await booking.save();
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTransportBooking = async (req: Request, res: Response) => {
  try {
    const booking = await TransportBooking.findByPk(req.params.id as string);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    await booking.destroy();
    res.status(200).json({ message: 'Booking deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransportBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const booking = await TransportBooking.findByPk(req.params.id as string);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
