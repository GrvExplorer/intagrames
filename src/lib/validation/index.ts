import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(3).max(50),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must be less than 50 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
});

export const SignInValidation = z.object({
  email: z.string().min(1, { message: "Please enter your email" }).email({ message: "Please enter a valid email" }),
  password: z.string()
  .min(1, { message: "Please enter your password" })
});

export const CreatePostValidation = z.object({
  caption: z.string().min(5, { message: "Caption must be at least 5 characters" }).max(2200, { message: "Caption must be less than 2200 characters" }),
  file: z.custom<File[]>(),
  location: z.string().min(1, {message: 'This field is required'}).max(1000, {message: 'Maximum 1000 characters.'}),
  tags: z.string()
})