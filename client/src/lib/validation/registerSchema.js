import { z } from "zod";

// MongoDB ObjectId Regex
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const baseSchema = {
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6 characters"),
  confirm_password: z.string().min(6, "Confirm password is required"),

  phone: z
    .string()
    // .min(10, "Phone must be 10 digits long")
    // .max(10, "Phone must be 10 digits long")
    .length(10, "Phone must be 10 digits long")
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),

  address: z.string().min(5, "Address required"),

  image: z.any().optional(),
};

// ----------------------
// 2. Convert into a Zod object & handle password match ONCE
// ----------------------
const baseZod = z
  .object(baseSchema)
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// ----------------------
// 3. USER schema
// ----------------------
export const userSchema = baseZod.safeExtend({
  role: z.enum(["user", "provider"]),
});


// ----------------------
// 4. PROVIDER schema
// ----------------------
export const providerSchema = baseZod.safeExtend({
  role: z.enum(["user", "provider"]),
  service_areas: z
    .array(z.string().regex(objectIdRegex, "Invalid service area ID"))
    .min(1, "Providers must select at least one service area"),
});


// export const providerSchema = z.object({
//     role: z.enum(["user", "provider"]),
//     ...baseSchema,
//     service_areas: z.string().min(3, "Service areas required"),
//     //   availability: z.string().min(3, "Availability status required"),
// });

export const registerSchema = (role) =>
  role === "provider" ? providerSchema : userSchema;
