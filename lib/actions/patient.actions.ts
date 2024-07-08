"use server";

import { Gender } from "@prisma/client";
import { parseStringify } from "../utils";
import { prisma } from "./prisma";

// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Cria um novo usuário
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

    return parseStringify(newUser);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Verifica se o usuário já existe
    if (error && error.code === "P2002") {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      return parseStringify(existingUser);
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({ ...patient }: RegisterUserParams) => {
  try {
    // Cria um novo documento de paciente
    const newPatient = await prisma.patient.create({
      data: {
        userId: patient.userId,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        birthDate: patient.birthDate,
        gender: patient.gender as Gender,
        address: patient.address,
        occupation: patient.occupation,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactNumber: patient.emergencyContactNumber,
        primaryPhysician: patient.primaryPhysician,
        insuranceProvider: patient.insuranceProvider,
        insurancePolicyNumber: patient.insurancePolicyNumber,
        allergies: patient.allergies,
        currentMedication: patient.currentMedication,
        familyMedicalHistory: patient.familyMedicalHistory,
        pastMedicalHistory: patient.pastMedicalHistory,
        identificationType: patient.identificationType,
        identificationNumber: patient.identificationNumber,
        identificationDocument: JSON.stringify(patient.identificationDocument),
        privacyConsent: patient.privacyConsent,
      },
    });

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patient = await prisma.patient.findFirst({
      where: { userId: userId },
    });

    return parseStringify(patient);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

// Função de upload de arquivo mock (substitua pelo seu código real)
const uploadFile = async (identificationDocument: FormData) => {
  // Substitua pelo seu código de upload de arquivo
  return {
    id: "file_id_example",
    url: "file_url_example",
  };
};
