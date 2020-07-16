import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

// LIST ALL APPOINTMENTS
appointmentsRouter.get('/', (req, res) => {
  const appointments = appointmentsRepository.findAll();

  return res.json(appointments);
});

// CREATE APPOINTMENT
appointmentsRouter.post('/', (req, res) => {
  const { provider, date } = req.body;

  const parsedDate = startOfHour(parseISO(date));

  const findAppointmentInSameDate = appointmentsRepository.findByDate(
    parsedDate,
  );

  if (findAppointmentInSameDate) {
    return res
      .status(400)
      .json({ error: 'This appointment is already booked!' });
  }

  const appointment = appointmentsRepository.create({
    provider,
    date: parsedDate,
  });

  return res.json(appointment);
});

export default appointmentsRouter;
