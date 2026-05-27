import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const driverRegisterSchema = registerSchema.extend({
  licenseNumber: z.string().min(5, "License number is required"),
  licenseExpiry: z.string().min(1, "License expiry date is required"),
  vehicleMake: z.string().min(1, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehicleYear: z.number().min(1990).max(2027),
  vehicleColor: z.string().min(1, "Vehicle color is required"),
  licensePlate: z.string().min(1, "License plate is required"),
});

export const rideRequestSchema = z.object({
  pickupLat: z.number(),
  pickupLng: z.number(),
  pickupAddress: z.string().min(1, "Pickup address is required"),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  dropoffAddress: z.string().min(1, "Dropoff address is required"),
});

export const ratingSchema = z.object({
  rideId: z.string(),
  score: z.number().min(1).max(5),
  comment: z.string().optional(),
});
