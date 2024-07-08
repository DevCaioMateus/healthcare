"use server";

import { AppointmentStatus } from "@prisma/client";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { formatDateTime, parseStringify } from "../utils";

// CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await prisma.appointment.create({
      data: {
        userId: appointment.userId,
        patientId: appointment.patientId,
        schedule: new Date(appointment.schedule),
        primaryPhysician: appointment.primaryPhysician,
        reason: appointment.reason,
        status: appointment.status as AppointmentStatus,
        note: appointment.note,
      },
    });

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

// GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = appointments.reduce((acc, appointment) => {
      switch (appointment.status) {
        case "AGENDADO":
          acc.scheduledCount++;
          break;
        case "PENDENTE":
          acc.pendingCount++;
          break;
        case "CANCELADO":
          acc.cancelledCount++;
          break;
      }
      return acc;
    }, initialCounts);

    const data = {
      totalCount: appointments.length,
      ...counts,
      documents: appointments,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

// SEND SMS NOTIFICATION
export const sendSMSNotification = async (userId: number, content: string) => {
  try {
    // Implement your SMS sending logic here
    // This is a mock function for demonstration
    const message = {
      id: "mock_message_id",
      userId,
      content,
    };

    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
  }
};

// UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: appointment,
    });

    if (!updatedAppointment) throw new Error();

    const smsMessage = `Greetings from CarePulse. ${
      type === "schedule"
        ? `Your appointment is confirmed for ${
            formatDateTime(appointment.schedule!).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform that your appointment for ${
            formatDateTime(appointment.schedule!).dateTime
          } is cancelled. Reason: ${appointment.cancellationReason}`
    }.`;
    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};

// GET APPOINTMENT
export const getAppointment = async (appointmentId: number) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};
